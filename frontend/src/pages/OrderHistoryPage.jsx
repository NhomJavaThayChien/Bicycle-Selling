import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getListingById } from "../services/bikeService";
import { createDispute } from "../services/disputeService";
import { completeOrder, getBuyerOrders } from "../services/orderService";
import { createReview } from "../services/reviewService";
import { formatPrice } from "../utils/formatPrice";

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

    fetchOrders();
  }, []);

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
      setReviewMessage("Đánh giá thành công.");
      setSelectedOrder(null);
      setComment("");
      setRating("5");
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      setReviewMessage(serverError || "Không thể gửi đánh giá lúc này.");
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
      setReviewMessage("Đã cập nhật trạng thái đã nhận hàng.");
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
      setReviewMessage(`Đã gửi báo tranh chấp cho đơn hàng #${disputeOrder.id}. Admin sẽ xử lý trong vòng 24h.`);
      setDisputeOrder(null);
      setDisputeReason("");
      setDisputeDesc("");
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      setError(serverError || "Không thể gửi tranh chấp lúc này.");
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

      {/* Form đánh giá */}
      {selectedOrder && (
        <section
          style={{
            marginTop: "16px",
            border: "1px solid #eaecf0",
            borderRadius: "12px",
            padding: "14px",
            backgroundColor: "#fcfcfd",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Viết đánh giá cho đơn hàng #{selectedOrder.id}</h3>

          <div style={{ display: "grid", gap: "10px", maxWidth: "420px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span>Số sao</span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(String(star))}
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      border: rating === String(star) ? "1px solid #0c6cf2" : "1px solid #d0d5dd",
                      backgroundColor: rating === String(star) ? "#eff8ff" : "#fff",
                      color: rating === String(star) ? "#0c6cf2" : "#344054",
                      fontSize: "1rem",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span>Nhận xét</span>
              <textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn"
              />
            </label>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={handleSubmitReview} disabled={submittingReview}>
                {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setComment("");
                  setRating("5");
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Form báo tranh chấp */}
      {disputeOrder && (
        <section
          style={{
            marginTop: "16px",
            border: "1px solid #fecdca",
            borderRadius: "12px",
            padding: "16px",
            backgroundColor: "#fff2f0",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#b42318" }}>
            ⚠️ Báo tranh chấp — Đơn hàng #{disputeOrder.id}
          </h3>
          <p style={{ margin: "0 0 12px", color: "#6b2a1f", fontSize: 13 }}>
            Khi gửi tranh chấp, Admin sẽ tiếp nhận và xử lý trong vòng 24h. Bạn chỉ có thể gửi 1 tranh chấp cho mỗi đơn hàng.
          </p>

          <div style={{ display: "grid", gap: 10, maxWidth: 480 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Lý do tranh chấp <span style={{ color: "red" }}>*</span></span>
              <select
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "1px solid #fecdca",
                  fontSize: 14,
                  background: "#fff",
                }}
              >
                <option value="">-- Chọn lý do --</option>
                <option value="Hàng không đúng mô tả">Hàng không đúng mô tả</option>
                <option value="Không nhận được hàng">Không nhận được hàng</option>
                <option value="Xe bị hư hỏng khi giao">Xe bị hư hỏng khi giao</option>
                <option value="Người bán không hợp tác">Người bán không hợp tác</option>
                <option value="Khác">Khác</option>
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Mô tả chi tiết</span>
              <textarea
                rows={4}
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                placeholder="Mô tả vấn đề cụ thể (điều kiện xe, bằng chứng, …)"
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "1px solid #fecdca",
                  fontSize: 14,
                  resize: "vertical",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={handleSubmitDispute}
                disabled={submittingDispute || !disputeReason}
                style={{
                  background: submittingDispute || !disputeReason ? "#d1d5db" : "#b42318",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  fontWeight: 700,
                  cursor: submittingDispute || !disputeReason ? "not-allowed" : "pointer",
                }}
              >
                {submittingDispute ? "Đang gửi..." : "Gửi tranh chấp"}
              </button>
              <button
                type="button"
                onClick={() => { setDisputeOrder(null); setError(""); }}
                style={{
                  background: "#fff",
                  border: "1px solid #fecdca",
                  borderRadius: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default OrderHistoryPage;
