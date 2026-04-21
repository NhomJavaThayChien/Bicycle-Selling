import api from "./api";

const mockReply = (question) => {
  const lower = question.toLowerCase();

  if (lower.includes("checkout") || lower.includes("pay")) {
    return "Ban co the vao trang Checkout, chon COD hoac Stripe, sau do gui don hang.";
  }

  if (lower.includes("review")) {
    return "Chi co the review sau khi don hang da COMPLETED.";
  }

  if (lower.includes("chat")) {
    return "Nhan Contact Seller trong trang detail de mo hoi thoai.";
  }

  if (lower.includes("seller")) {
    return "Trang seller profile se hien thi diem uy tin, so review va danh sach xe dang ban.";
  }

  return "Minh co the giup ban tim xe, dat mua, chat voi seller, review va kiem tra don hang.";
};

export const askGemini = async (question) => {
  try {
    const response = await api.post("/chatbot/ask", { question });
    return response.data?.answer || response.data?.message || mockReply(question);
  } catch {
    return mockReply(question);
  }
};
