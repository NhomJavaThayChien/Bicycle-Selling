import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteListing,
  getMyListings,
} from "../services/sellerListingService";
import { formatPrice } from "../utils/formatPrice";
import { inspectionService } from "../services/inspectionService";
import { getSellerOrders, confirmOrder, rejectOrder } from "../services/orderService";
import { getDisputeByOrderId } from "../services/disputeService";
import { message, Modal, Typography, Tag, Space, Button } from "antd"; // Use antd for better feedback

const { Text } = Typography;

const statusStyleMap = {
  ACTIVE: { backgroundColor: "#ecfdf3", color: "#067647", border: "#abefc6" },
  SOLD: { backgroundColor: "#f2f4f7", color: "#344054", border: "#d0d5dd" },
  PENDING: { backgroundColor: "#fff4ed", color: "#b54708", border: "#fedf89" },
  REJECTED: { backgroundColor: "#fef3f2", color: "#b42318", border: "#fecdca" },
  DISPUTED: { backgroundColor: "#f4f3ff", color: "#5925dc", border: "#d9d6fe" },
};

const inspectionStatusStyleMap = {
  PASSED: { backgroundColor: "#ecfdf3", color: "#027a48", border: "#abefc6", label: "Đã kiểm định" },
  FAILED: { backgroundColor: "#fef3f2", color: "#b42318", border: "#fecdca", label: "Không đạt" },
  REQUESTED: { backgroundColor: "#eff8ff", color: "#175cd3", border: "#b2ddff", label: "Đang chờ" },
};

function SellerDashboardPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [requestingId, setRequestingId] = useState(null);
  
  const [activeTab, setActiveTab] = useState("listings"); // "listings" or "orders"
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  // Dispute viewing state
  const [viewDisputeTarget, setViewDisputeTarget] = useState(null);
  const [disputeData, setDisputeData] = useState(null);
  const [loadingDispute, setLoadingDispute] = useState(false);

  const sortedListings = useMemo(
    () =>
      [...listings].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [listings],
  );

  const loadMyListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyListings();
      setListings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Khong tai duoc danh sach bai dang. Vui long thu lai.";
      setError(message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyListings();
    loadSellerOrders();
  }, [loadMyListings]);

  const loadSellerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await getSellerOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Ban co chac muon xoa bai dang nay?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Khong the xoa bai dang. Vui long thu lai.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequestInspection = async (listingId) => {
    try {
      setRequestingId(listingId);
      await inspectionService.request(listingId);
      // Refresh list to show new status
      await loadMyListings();
      alert("Đã gửi yêu cầu kiểm định thành công!");
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể yêu cầu kiểm định.");
    } finally {
      setRequestingId(null);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      setProcessingOrderId(orderId);
      await confirmOrder(orderId);
      message.success("Đã xác nhận đơn hàng!");
      loadSellerOrders();
      loadMyListings(); // To update listing status if it changes
    } catch (err) {
      message.error(err?.response?.data?.error || "Không thể xác nhận đơn hàng.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn từ chối đơn hàng này?")) return;
    try {
      setProcessingOrderId(orderId);
      await rejectOrder(orderId);
      message.success("Đã từ chối đơn hàng.");
      loadSellerOrders();
      loadMyListings();
    } catch (err) {
      message.error(err?.response?.data?.error || "Không thể từ chối đơn hàng.");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleViewDispute = async (orderId) => {
    setLoadingDispute(true);
    setViewDisputeTarget(orderId);
    try {
      const res = await getDisputeByOrderId(orderId);
      setDisputeData(res.data);
    } catch (err) {
      message.error("Không thể tải thông tin tranh chấp.");
      setViewDisputeTarget(null);
    } finally {
      setLoadingDispute(false);
    }
  };

  return (
    <main style={{ maxWidth: "1100px", margin: "24px auto", padding: "0 16px" }}>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "6px" }}>Seller Dashboard</h1>
          <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
            <button 
              onClick={() => setActiveTab("listings")}
              style={{
                ...tabButtonStyle,
                color: activeTab === "listings" ? "#0c6cf2" : "#64748b",
                borderBottom: activeTab === "listings" ? "2px solid #0c6cf2" : "none",
              }}
            >
              Tin đăng ({listings.length})
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              style={{
                ...tabButtonStyle,
                color: activeTab === "orders" ? "#0c6cf2" : "#64748b",
                borderBottom: activeTab === "orders" ? "2px solid #0c6cf2" : "none",
              }}
            >
              Đơn hàng ({orders.length})
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => navigate("/inbox")}
            style={{
              border: "1px solid #d0d5dd",
              borderRadius: "8px",
              padding: "10px 14px",
              backgroundColor: "#fff",
              color: "#344054",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Messages
          </button>
          <button
            type="button"
            onClick={() => navigate("/seller/create")}
            style={{
              border: "none",
              borderRadius: "8px",
              padding: "10px 14px",
              backgroundColor: "#0c6cf2",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create New Listing
          </button>
        </div>
      </section>

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

      {loading || loadingOrders ? (
        <p>Đang tải dữ liệu...</p>
      ) : activeTab === "listings" ? (
        sortedListings.length === 0 ? (
          <section
            style={{
              border: "1px dashed #d0d5dd",
              borderRadius: "10px",
              padding: "24px",
              textAlign: "center",
              backgroundColor: "#fcfcfd",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "14px" }}>
              Bạn chưa có bài đăng nào.
            </p>
            <button
              type="button"
              onClick={() => navigate("/seller/create")}
              style={{
                border: "none",
                borderRadius: "8px",
                padding: "10px 14px",
                backgroundColor: "#101828",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Đăng bài đầu tiên
            </button>
          </section>
        ) : (
          <div style={{ overflowX: "auto", border: "1px solid #eaecf0", borderRadius: "12px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th style={thStyle}>Ảnh</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Inspection</th>
                  <th style={thStyle}>Created Date</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedListings.map((listing) => {
                  const statusStyle = statusStyleMap[listing.status] || {
                    backgroundColor: "#f2f4f7",
                    color: "#344054",
                    border: "#d0d5dd",
                  };

                  return (
                    <tr key={listing.id} style={{ borderTop: "1px solid #eaecf0" }}>
                      <td style={tdStyle}>
                        <img 
                          src={listing.primaryImageUrl?.startsWith("/uploads") 
                            ? `http://localhost:8080${listing.primaryImageUrl}` 
                            : (listing.primaryImageUrl || "https://via.placeholder.com/60x40?text=No+Img")} 
                          alt="thumb" 
                          style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eee" }}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/60x40?text=Error"; }}
                        />
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600 }}>{listing.title}</div>
                        {listing.status === 'REJECTED' && listing.rejectionReason && (
                          <div style={{ color: '#b42318', fontSize: '0.8rem', marginTop: '4px' }}>
                            Lý do: {listing.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td style={tdStyle}>{formatPrice(Number(listing.price))}</td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "999px",
                            border: `1px solid ${statusStyle.border}`,
                            backgroundColor: statusStyle.backgroundColor,
                            color: statusStyle.color,
                            fontSize: "0.82rem",
                            fontWeight: 600,
                          }}
                        >
                          {listing.status || "UNKNOWN"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {listing.inspectionStatus ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "999px",
                              border: `1px solid ${inspectionStatusStyleMap[listing.inspectionStatus]?.border || "#d0d5dd"}`,
                              backgroundColor: inspectionStatusStyleMap[listing.inspectionStatus]?.backgroundColor || "#f2f4f7",
                              color: inspectionStatusStyleMap[listing.inspectionStatus]?.color || "#344054",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            {inspectionStatusStyleMap[listing.inspectionStatus]?.label || listing.inspectionStatus}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRequestInspection(listing.id)}
                            disabled={requestingId === listing.id}
                            style={{
                              ...secondaryBtnStyle,
                              fontSize: "0.82rem",
                              padding: "4px 8px",
                              backgroundColor: "#f9fafb",
                              borderColor: "#d0d5dd"
                            }}
                          >
                            {requestingId === listing.id ? "Đang gửi..." : "Yêu cầu kiểm định"}
                          </button>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {listing.createdAt
                          ? new Date(listing.createdAt).toLocaleString("vi-VN")
                          : "-"}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => navigate(`/seller/edit/${listing.id}`)}
                            style={secondaryBtnStyle}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(listing.id)}
                            disabled={deletingId === listing.id}
                            style={{
                              ...dangerBtnStyle,
                              opacity: deletingId === listing.id ? 0.6 : 1,
                              cursor: deletingId === listing.id ? "not-allowed" : "pointer",
                            }}
                          >
                            {deletingId === listing.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* ORDERS TAB */
        orders.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", border: "1px dashed #d0d5dd", borderRadius: "12px" }}>
            Chưa có đơn hàng nào cho các xe của bạn.
          </p>
        ) : (
          <div style={{ overflowX: "auto", border: "1px solid #eaecf0", borderRadius: "12px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th style={thStyle}>Mã ĐH</th>
                  <th style={thStyle}>Sản phẩm</th>
                  <th style={thStyle}>Giá chốt</th>
                  <th style={thStyle}>Người mua</th>
                  <th style={thStyle}>Trạng thái</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderTop: "1px solid #eaecf0" }}>
                    <td style={tdStyle}>#{order.id}</td>
                    <td style={tdStyle}>{order.listingTitle}</td>
                    <td style={tdStyle}>{formatPrice(Number(order.agreedPrice))}</td>
                    <td style={tdStyle}>{order.buyerFullName || order.buyerUsername}</td>
                    <td style={tdStyle}>
                       <span style={{
                         padding: "4px 8px",
                         borderRadius: "999px",
                         fontSize: "0.8rem",
                         fontWeight: 600,
                         backgroundColor: "#f2f4f7",
                         color: "#344054"
                       }}>
                         {order.status}
                       </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {order.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              disabled={processingOrderId === order.id}
                              style={{ ...secondaryBtnStyle, backgroundColor: "#0c6cf2", color: "#fff", border: "none" }}
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              disabled={processingOrderId === order.id}
                              style={dangerBtnStyle}
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {order.status === "CONFIRMED" && (
                           <span style={{ color: "#067647", fontSize: "0.85rem" }}>Đã xác nhận deal</span>
                        )}
                        {order.status === "COMPLETED" && (
                           <span style={{ color: "#067647", fontSize: "0.85rem" }}>Giao dịch thành công</span>
                        )}
                        {order.status === "CANCELLED" && (
                           <span style={{ color: "#b42318", fontSize: "0.85rem" }}>Đã hủy</span>
                        )}
                        {order.status === "DISPUTED" && (
                           <button
                             onClick={() => handleViewDispute(order.id)}
                             style={{ ...secondaryBtnStyle, backgroundColor: "#f4f3ff", color: "#5925dc", borderColor: "#d9d6fe" }}
                           >
                             Xem phán quyết
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Dispute Details Modal */}
      <Modal
        title={`Chi tiết tranh chấp — Đơn hàng #${viewDisputeTarget}`}
        open={!!viewDisputeTarget}
        onCancel={() => { setViewDisputeTarget(null); setDisputeData(null); }}
        footer={<Button onClick={() => setViewDisputeTarget(null)}>Đóng</Button>}
        loading={loadingDispute}
        centered
      >
        {disputeData ? (
          <div style={{ display: "grid", gap: 12, padding: "10px 0" }}>
            <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #eaecf0" }}>
              <Text type="secondary" style={{ fontSize: "0.85rem", display: "block", marginBottom: 4 }}>Trạng thái tranh chấp</Text>
              <Tag color={disputeData.status === "RESOLVED" ? "green" : disputeData.status === "OPEN" ? "red" : "blue"}>
                {disputeData.status === "RESOLVED" ? "Đã giải quyết" : disputeData.status === "OPEN" ? "Đang chờ" : "Đang xử lý"}
              </Tag>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: 4 }}>Lý do tranh chấp từ người mua:</Text>
              <div style={{ padding: "10px", backgroundColor: "#fff5f5", borderRadius: "6px", border: "1px solid #febca0" }}>
                <Text style={{ fontWeight: 600, color: "#c0392b" }}>{disputeData.reason}</Text>
                {disputeData.description && (
                  <Text style={{ display: "block", marginTop: 6, fontSize: "0.9rem" }}>{disputeData.description}</Text>
                )}
              </div>
            </div>

            {disputeData.resolution ? (
              <div style={{ marginTop: 8 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>Phán quyết của Admin:</Text>
                <div style={{ padding: "12px", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bcf0da" }}>
                  <Text style={{ color: "#166534", fontWeight: 500 }}>{disputeData.resolution}</Text>
                  {disputeData.resolvedAt && (
                    <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: "0.75rem" }}>
                      Thời gian: {new Date(disputeData.resolvedAt).toLocaleString("vi-VN")}
                    </Text>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 8, padding: "12px", backgroundColor: "#eff8ff", borderRadius: "8px", border: "1px solid #b2ddff" }}>
                <Text style={{ color: "#175cd3" }}>Admin đang xem xét bằng chứng và sẽ đưa ra phán quyết sớm nhất.</Text>
              </div>
            )}
            
            {disputeData.evidenceUrls && (
              <div style={{ marginTop: 4 }}>
                <Text strong style={{ display: "block", marginBottom: 4 }}>Bằng chứng:</Text>
                <a href={disputeData.evidenceUrls} target="_blank" rel="noreferrer" style={{ color: "#0c6cf2", fontSize: "0.9rem" }}>
                  Xem tài liệu/hình ảnh đính kèm
                </a>
              </div>
            )}
          </div>
        ) : !loadingDispute && (
          <p>Không tìm thấy dữ liệu tranh chấp.</p>
        )}
      </Modal>
    </main>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: "0.85rem",
  color: "#344054",
};

const tdStyle = {
  padding: "12px",
  fontSize: "0.95rem",
  color: "#101828",
};

const secondaryBtnStyle = {
  border: "1px solid #d0d5dd",
  borderRadius: "8px",
  backgroundColor: "#fff",
  color: "#344054",
  padding: "6px 10px",
  cursor: "pointer",
};

const dangerBtnStyle = {
  border: "1px solid #fda29b",
  borderRadius: "8px",
  backgroundColor: "#fef3f2",
  color: "#b42318",
  padding: "6px 10px",
};

const tabButtonStyle = {
  background: "none",
  border: "none",
  padding: "8px 0",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

export default SellerDashboardPage;
