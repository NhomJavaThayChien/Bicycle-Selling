import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getListingById } from "../services/bikeService";
import { createDispute, getMyDisputedOrderIds } from "../services/disputeService";
import { completeOrder, getBuyerOrders } from "../services/orderService";
import { createReview, getMyReviewedOrderIds } from "../services/reviewService";
import { formatPrice } from "../utils/formatPrice";
import {
  Modal,
  Button,
  Rate,
  Form,
  Input,
  Select,
  Alert,
  message as antdMessage,
  Typography,
  Space,
} from "antd";
import { AlertTriangle, Star, CheckCircle } from "lucide-react";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

const statusStyleMap = {
  PENDING: { background: "#fffaeb", color: "#b54708", border: "#fedf89", label: "Chờ xác nhận" },
  DEPOSIT_PAID: { background: "#eef4ff", color: "#3538cd", border: "#c7d7fe", label: "Đã đặt cọc" },
  FULL_PAID: { background: "#ecfdf3", color: "#067647", border: "#abefc6", label: "Đã thanh toán" },
  CONFIRMED: { background: "#ecfdf3", color: "#027a48", border: "#a6f4c5", label: "Đã xác nhận" },
  SHIPPING: { background: "#eff8ff", color: "#175cd3", border: "#b2ddff", label: "Đang giao hàng" },
  COMPLETED: { background: "#ecfdf3", color: "#027a48", border: "#abefc6", label: "Hoàn thành" },
  CANCELLED: { background: "#fef3f2", color: "#b42318", border: "#fecdca", label: "Đã hủy" },
  DISPUTED: { background: "#f4f3ff", color: "#5925dc", border: "#d9d6fe", label: "Tranh chấp" },
};

const getStatusInfo = (status) => statusStyleMap[status] || {
  background: "#f2f4f7",
  color: "#344054",
  border: "#d0d5dd",
  label: status
};

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [listingLookup, setListingLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewedOrderIds, setReviewedOrderIds] = useState([]);
  const [completingOrderId, setCompletingOrderId] = useState(null);

  // Dispute state
  const [disputeOrder, setDisputeOrder]         = useState(null); // order đang mở form
  const [disputeReason, setDisputeReason]       = useState("");
  const [disputeDesc, setDisputeDesc]           = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [disputedOrderIds, setDisputedOrderIds] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchReviewStates();
    fetchDisputeStates();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getBuyerOrders();
      const orderData = Array.isArray(response.data) ? response.data : [];
      setOrders(orderData);

      const uniqueListingIds = [...new Set(orderData.map((order) => order.listingId))];

      const listingEntries = await Promise.all(
        uniqueListingIds.map(async (listingId) => {
          try {
            const listingResponse = await getListingById(listingId);
            return [listingId, listingResponse.data];
          } catch {
            return [listingId, null];
          }
        }),
      );

      setListingLookup(Object.fromEntries(listingEntries));
    } catch (err) {
      const serverError = err?.response?.data?.error || err?.response?.data?.message;
      setError(serverError || "Không tải được lịch sử đơn hàng.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewStates = async () => {
    try {
      const res = await getMyReviewedOrderIds();
      setReviewedOrderIds(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải trạng thái đánh giá:", err);
    }
  };

  const fetchDisputeStates = async () => {
    try {
      const res = await getMyDisputedOrderIds();
      setDisputedOrderIds(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải trạng thái tranh chấp:", err);
    }
  };

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => Number(b.id) - Number(a.id)),
    [orders],
  );

  const handleSubmitReview = async () => {
    if (!selectedOrder) {
      return;
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      setReviewMessage("Rating phải trong khoảng 1-5.");
      return;
    }

    setSubmittingReview(true);
    setReviewMessage("");

    try {
      await createReview(selectedOrder.id, {
        rating: numericRating,
        comment: comment.trim() || null,
        accuracyRating: numericRating,
        communicationRating: numericRating,
      });

      setReviewedOrderIds((prev) => [...new Set([...prev, selectedOrder.id])]);
      antdMessage.success("Cảm ơn bạn đã gửi đánh giá!");
      
      setSelectedOrder(null);
      setComment("");
      setRating(5); // antd Rate uses numbers
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      antdMessage.error(serverError || "Không thể gửi đánh giá lúc này.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    if (!orderId) {
      return;
    }

    setCompletingOrderId(orderId);
    setError("");
    setReviewMessage("");

    try {
      await completeOrder(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "COMPLETED" } : order,
        ),
      );
      antdMessage.success("Đã xác nhận đã nhận hàng.");
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      setError(serverError || "Không thể cập nhật trạng thái lúc này.");
    } finally {
      setCompletingOrderId(null);
    }
  };

  // Buyer gửi tranh chấp
  const handleSubmitDispute = async () => {
    if (!disputeOrder) return;
    if (!disputeReason.trim()) {
      setError("Điền lý do tranh chấp.");
      return;
    }
    setSubmittingDispute(true);
    setError("");
    setReviewMessage("");
    try {
      await createDispute({
        orderId: disputeOrder.id,
        reason: disputeReason.trim(),
        description: disputeDesc.trim() || undefined,
      });
      setDisputedOrderIds((prev) => [...new Set([...prev, disputeOrder.id])]);
      
      // Cập nhật trạng thái đơn hàng trong list ngay lập tức
      setOrders((prev) =>
        prev.map((o) =>
          o.id === disputeOrder.id ? { ...o, status: "DISPUTED" } : o
        )
      );

      antdMessage.warning(`Đã gửi báo tranh chấp cho đơn hàng #${disputeOrder.id}.`);
      setDisputeOrder(null);
      setDisputeReason("");
      setDisputeDesc("");
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      antdMessage.error(serverError || "Không thể gửi tranh chấp lúc này.");
    } finally {
      setSubmittingDispute(false);
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: "920px", margin: "24px auto", padding: "0 16px" }}>
        <p>Đang tải lịch sử đơn hàng...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "920px", margin: "24px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h1 style={{ marginTop: 0 }}>Lịch sử đơn hàng</h1>
        <Link to="/bikes" style={{ color: "#175cd3", fontWeight: 600 }}>
          Tiếp tục mua sắm
        </Link>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "14px",
            border: "1px solid #fecdca",
            backgroundColor: "#fef3f2",
            color: "#b42318",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          {error}
        </div>
      )}

      {reviewMessage && (
        <div
          style={{
            marginBottom: "14px",
            border: "1px solid #b2ddff",
            backgroundColor: "#eff8ff",
            color: "#175cd3",
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        >
          {reviewMessage}
        </div>
      )}

      {sortedOrders.length === 0 ? (
        <section
          style={{
            border: "1px dashed #d0d5dd",
            borderRadius: "10px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: "#fcfcfd",
          }}
        >
          <p style={{ marginTop: 0 }}>Bạn chưa có đơn hàng nào.</p>
          <Link to="/bikes" style={{ color: "#175cd3", fontWeight: 600 }}>
            Mua xe ngay
          </Link>
        </section>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {sortedOrders.map((order) => {
            const statusStyle = statusStyleMap[order.status] || {
              background: "#f2f4f7",
              color: "#344054",
              border: "#d0d5dd",
            };

            const listing = listingLookup[order.listingId] || null;
            const bikeTitle = listing?.title || `Listing #${order.listingId}`;

            return (
              <article
                key={order.id}
                style={{
                  border: "1px solid #eaecf0",
                  borderRadius: "12px",
                  padding: "14px",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "8px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "999px",
                      border: `1px solid ${statusStyle.border}`,
                      backgroundColor: statusStyle.background,
                      color: statusStyle.color,
                      fontSize: "0.82rem",
                      fontWeight: 700,
                    }}
                  >
                    {getStatusInfo(order.status).label}
                  </span>
                </div>

                <p style={{ margin: "4px 0" }}>Xe: {bikeTitle}</p>
                <p style={{ margin: "4px 0" }}>Mã tin đăng: #{order.listingId}</p>
                <p style={{ margin: "4px 0" }}>
                  Giá thoả thuận: {formatPrice(Number(order.agreedPrice || 0))}
                </p>
                <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    disabled={
                      !["CONFIRMED", "FULL_PAID", "SHIPPING"].includes(order.status) ||
                      completingOrderId === order.id
                    }
                    onClick={() => handleCompleteOrder(order.id)}
                    style={{
                      border: "1px solid #d0d5dd",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      backgroundColor:
                        !["CONFIRMED", "FULL_PAID", "SHIPPING"].includes(order.status)
                          ? "#f2f4f7"
                          : "#0c6cf2",
                      color: !["CONFIRMED", "FULL_PAID", "SHIPPING"].includes(order.status)
                        ? "#344054"
                        : "#fff",
                      cursor: !["CONFIRMED", "FULL_PAID", "SHIPPING"].includes(order.status)
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {order.status === "COMPLETED"
                      ? "Đã nhận hàng"
                      : completingOrderId === order.id
                        ? "Đang cập nhật..."
                        : order.status === "PENDING"
                          ? "Chờ xác nhận"
                          : "Xác nhận đã nhận hàng"}
                  </button>
                  <button
                    type="button"
                    disabled={order.status !== "COMPLETED" || reviewedOrderIds.includes(order.id)}
                    onClick={() => {
                      setSelectedOrder(order);
                      setReviewMessage("");
                    }}
                    style={{
                      border: "1px solid #d0d5dd",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      backgroundColor:
                        order.status === "COMPLETED" && !reviewedOrderIds.includes(order.id)
                          ? "#fff"
                          : "#f2f4f7",
                      color: "#344054",
                      cursor:
                        order.status === "COMPLETED" && !reviewedOrderIds.includes(order.id)
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {reviewedOrderIds.includes(order.id)
                      ? "Đã đánh giá"
                      : order.status === "COMPLETED"
                        ? "Đánh giá"
                        : "Đánh giá (sau khi hoàn thành)"}
                  </button>
                  {/* Nút báo tranh chấp — hiện khi đơn đang active hoặc đã hoàn thành, chưa báo */}
                  {["FULL_PAID", "CONFIRMED", "SHIPPING", "COMPLETED"].includes(order.status) &&
                    !disputedOrderIds.includes(order.id) && (
                    <button
                      type="button"
                      onClick={() => {
                        setDisputeOrder(order);
                        setDisputeReason("");
                        setDisputeDesc("");
                        setError("");
                      }}
                      style={{
                        border: "1px solid #fecdca",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        backgroundColor: "#fff2f0",
                        color: "#b42318",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      ⚠️ Báo tranh chấp
                    </button>
                  )}
                  {disputedOrderIds.includes(order.id) && (
                    <span style={{
                      fontSize: "0.8rem",
                      color: "#5925dc",
                      border: "1px solid #d9d6fe",
                      background: "#f4f3ff",
                      borderRadius: 6,
                      padding: "4px 8px",
                    }}>
                      ⚠️ Đã báo tranh chấp
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal đánh giá */}
      <Modal
        title={
          <Space>
            <Star color="#fadb14" fill="#fadb14" size={20} />
            <span>Đánh giá đơn hàng #{selectedOrder?.id}</span>
          </Space>
        }
        open={!!selectedOrder}
        onCancel={() => {
          setSelectedOrder(null);
          setComment("");
          setRating(5);
        }}
        footer={[
          <Button key="back" onClick={() => setSelectedOrder(null)}>
            Hủy bỏ
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submittingReview}
            onClick={handleSubmitReview}
            style={{ backgroundColor: "#0c6cf2" }}
          >
            Gửi đánh giá
          </Button>,
        ]}
        centered
        width={500}
      >
        <div style={{ padding: "10px 0" }}>
          <Form layout="vertical">
            <Form.Item label="Số sao (Chất lượng sản phẩm & dịch vụ)" required>
              <Rate
                value={Number(rating)}
                onChange={(val) => setRating(val)}
                style={{ fontSize: 28 }}
              />
              {rating > 0 && (
                <span style={{ marginLeft: 16, fontWeight: 600, color: "#faad14" }}>
                  {rating} / 5 sao
                </span>
              )}
            </Form.Item>

            <Form.Item label="Nhận xét chi tiết" required>
              <TextArea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về chiếc xe và người bán..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Form>
          <Alert
            message="Đánh giá của bạn giúp cộng đồng BikeMarket phát triển minh bạch hơn."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      </Modal>

      {/* Modal báo tranh chấp */}
      <Modal
        title={
          <Space>
            <AlertTriangle color="#ff4d4f" size={20} />
            <span style={{ color: "#ff4d4f" }}>Báo tranh chấp — Đơn hàng #{disputeOrder?.id}</span>
          </Space>
        }
        open={!!disputeOrder}
        onCancel={() => setDisputeOrder(null)}
        footer={[
          <Button key="back" onClick={() => setDisputeOrder(null)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={submittingDispute}
            disabled={!disputeReason}
            onClick={handleSubmitDispute}
          >
            Gửi báo cáo
          </Button>,
        ]}
        centered
        width={520}
      >
        <div style={{ padding: "10px 0" }}>
          <Paragraph type="secondary" style={{ marginBottom: 20 }}>
            Lưu ý: Khi gửi tranh chấp, đội ngũ Admin sẽ tiếp nhận và xử lý trong vòng 24h làm việc. Bạn chỉ có thể gửi tranh chấp 01 lần duy nhất cho mỗi đơn hàng.
          </Paragraph>

          <Form layout="vertical">
            <Form.Item label="Lý do tranh chấp" required>
              <Select
                value={disputeReason}
                onChange={(val) => setDisputeReason(val)}
                placeholder="Chọn lý do chính..."
                size="large"
              >
                <Select.Option value="Hàng không đúng mô tả">Hàng không đúng mô tả</Select.Option>
                <Select.Option value="Không nhận được hàng">Không nhận được hàng</Select.Option>
                <Select.Option value="Xe bị hư hỏng khi giao">Xe bị hư hỏng khi giao</Select.Option>
                <Select.Option value="Người bán không hợp tác">Người bán không hợp tác</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Mô tả chi tiết & Bằng chứng">
              <TextArea
                rows={5}
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                placeholder="Mô tả cụ thể vấn đề (ví dụ: vết xước không có trong ảnh, phụ kiện thiếu, ...)"
              />
            </Form.Item>
          </Form>

          <Alert
            message="Hãy giữ lại các bằng chứng (hình ảnh, video, tin nhắn) để hỗ trợ quá trình đối soát."
            type="warning"
            showIcon
            style={{ marginTop: 8 }}
          />
        </div>
      </Modal>
    </main>
  );
}

export default OrderHistoryPage;
