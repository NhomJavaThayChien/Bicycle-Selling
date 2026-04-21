import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getListingById } from "../services/bikeService";
import { getBuyerOrders } from "../services/orderService";
import { createReview } from "../services/reviewService";
import { formatPrice } from "../utils/formatPrice";

const statusStyleMap = {
  PENDING: { background: "#fffaeb", color: "#b54708", border: "#fedf89" },
  DEPOSIT_PAID: { background: "#eef4ff", color: "#3538cd", border: "#c7d7fe" },
  FULL_PAID: { background: "#ecfdf3", color: "#067647", border: "#abefc6" },
  CONFIRMED: { background: "#ecfdf3", color: "#027a48", border: "#a6f4c5" },
  SHIPPING: { background: "#eff8ff", color: "#175cd3", border: "#b2ddff" },
  COMPLETED: { background: "#ecfdf3", color: "#027a48", border: "#abefc6" },
  CANCELLED: { background: "#fef3f2", color: "#b42318", border: "#fecdca" },
  DISPUTED: { background: "#f4f3ff", color: "#5925dc", border: "#d9d6fe" },
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
        setError(serverError || "Khong tai duoc lich su don hang.");
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
      setReviewMessage("Rating phai trong khoang 1-5.");
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
      setReviewMessage("Danh gia thanh cong.");
      setSelectedOrder(null);
      setComment("");
      setRating("5");
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error;
      setReviewMessage(serverError || "Khong the gui danh gia luc nay.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: "920px", margin: "24px auto", padding: "0 16px" }}>
        <p>Dang tai lich su don hang...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "920px", margin: "24px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <h1 style={{ marginTop: 0 }}>Order History</h1>
        <Link to="/bikes" style={{ color: "#175cd3", fontWeight: 600 }}>
          Continue shopping
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
          <p style={{ marginTop: 0 }}>Ban chua co don hang nao.</p>
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
                    {order.status}
                  </span>
                </div>

                <p style={{ margin: "4px 0" }}>Bike: {bikeTitle}</p>
                <p style={{ margin: "4px 0" }}>Listing ID: {order.listingId}</p>
                <p style={{ margin: "4px 0" }}>
                  Agreed Price: {formatPrice(Number(order.agreedPrice || 0))}
                </p>
                <div style={{ marginTop: "10px" }}>
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
                      ? "Reviewed"
                      : order.status === "COMPLETED"
                        ? "Review"
                        : "Review (available after completed)"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

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
          <h3 style={{ marginTop: 0 }}>Write Review for Order #{selectedOrder.id}</h3>

          <div style={{ display: "grid", gap: "10px", maxWidth: "420px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span>Rating</span>
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
              <span>Comment</span>
              <textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Chia se trai nghiem cua ban"
              />
            </label>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={handleSubmitReview} disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setComment("");
                  setRating("5");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default OrderHistoryPage;
