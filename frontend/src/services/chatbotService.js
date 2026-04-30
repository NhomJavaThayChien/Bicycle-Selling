const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// System prompt mô tả context của marketplace
const SYSTEM_PROMPT = `Bạn là trợ lý AI của BikeMarket — nền tảng mua bán xe đạp cũ tại Việt Nam.
Nhiệm vụ của bạn là hỗ trợ người dùng với các vấn đề liên quan đến:
- Tìm kiếm và xem thông tin xe đạp (trang /bikes)
- Quy trình đặt hàng và thanh toán (COD hoặc thanh toán 100% qua Stripe)
- Theo dõi đơn hàng (trang /orders) với các trạng thái: PENDING → FULL_PAID → CONFIRMED → SHIPPING → COMPLETED
- Chat với người bán (trang /inbox)
- Đánh giá người bán sau khi đơn hàng COMPLETED
- Đăng bán xe đạp (trang /seller/create)
- Wishlist (trang /wishlist)
- Xem profile người bán (/users/:id/profile)

Lưu ý:
- Trả lời ngắn gọn, thân thiện, bằng tiếng Việt.
- Nếu câu hỏi không liên quan đến BikeMarket, hãy nhẹ nhàng nhắc lại phạm vi hỗ trợ.
- Không bịa đặt thông tin sản phẩm cụ thể, chỉ hướng dẫn về quy trình.`;

// Fallback khi không có API key hoặc API lỗi
const mockReply = (question) => {
  const lower = question.toLowerCase();

  if (lower.includes("checkout") || lower.includes("thanh toán") || lower.includes("mua")) {
    return "Bạn có thể vào trang Checkout, chọn COD (tiền mặt khi nhận hàng) hoặc thanh toán 100% qua Stripe, sau đó xác nhận đặt hàng.";
  }
  if (lower.includes("review") || lower.includes("đánh giá")) {
    return "Bạn chỉ có thể đánh giá người bán sau khi đơn hàng đã chuyển sang trạng thái COMPLETED (đã nhận hàng).";
  }
  if (lower.includes("chat") || lower.includes("liên hệ") || lower.includes("người bán")) {
    return "Nhấn nút 'Liên hệ người bán' trong trang chi tiết sản phẩm để mở hội thoại chat trực tiếp.";
  }
  if (lower.includes("đơn hàng") || lower.includes("order") || lower.includes("theo dõi")) {
    return "Vào trang 'Lịch sử đơn hàng' (/orders) để xem trạng thái tất cả đơn hàng của bạn.";
  }
  if (lower.includes("đăng bán") || lower.includes("bán xe")) {
    return "Vào trang 'Đăng bán' (/seller/create) để tạo tin đăng xe đạp. Tin sẽ cần admin duyệt trước khi hiển thị.";
  }
  return "Mình có thể giúp bạn tìm xe, đặt mua, chat với người bán, đánh giá và kiểm tra đơn hàng. Bạn cần hỗ trợ gì?";
};

// Lịch sử hội thoại cho multi-turn (giữ ngữ cảnh)
let conversationHistory = [];

export const resetConversation = () => {
  conversationHistory = [];
};

export const askGemini = async (question) => {
  if (!GEMINI_API_KEY) {
    return mockReply(question);
  }

  // Thêm câu hỏi của user vào lịch sử
  conversationHistory.push({
    role: "user",
    parts: [{ text: question }],
  });

  // Giới hạn lịch sử tối đa 10 lượt để tránh token quá dài
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Gemini API error:", err);
      conversationHistory.pop(); // xóa câu hỏi nếu thất bại
      return mockReply(question);
    }

    const data = await res.json();
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      mockReply(question);

    // Thêm câu trả lời vào lịch sử để giữ context
    conversationHistory.push({
      role: "model",
      parts: [{ text: answer }],
    });

    return answer;
  } catch (err) {
    console.error("Gemini fetch error:", err);
    conversationHistory.pop();
    return mockReply(question);
  }
};
