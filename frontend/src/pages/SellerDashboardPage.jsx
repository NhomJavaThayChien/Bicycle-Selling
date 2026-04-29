import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteListing,
  getMyListings,
} from "../services/sellerListingService";
import { formatPrice } from "../utils/formatPrice";
import { inspectionService } from "../services/inspectionService";

const statusStyleMap = {
  ACTIVE: { backgroundColor: "#ecfdf3", color: "#067647", border: "#abefc6" },
  SOLD: { backgroundColor: "#f2f4f7", color: "#344054", border: "#d0d5dd" },
  PENDING: { backgroundColor: "#fff4ed", color: "#b54708", border: "#fedf89" },
  REJECTED: { backgroundColor: "#fef3f2", color: "#b42318", border: "#fecdca" },
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
  }, [loadMyListings]);

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
          <p style={{ margin: 0, color: "#475467" }}>
            Quan ly bai dang: xem trang thai, sua va xoa.
          </p>
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

      {loading ? (
        <p>Dang tai danh sach bai dang...</p>
      ) : sortedListings.length === 0 ? (
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
            Ban chua co bai dang nao.
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
            Dang bai dau tien
          </button>
        </section>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #eaecf0", borderRadius: "12px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
            <thead style={{ backgroundColor: "#f9fafb" }}>
              <tr>
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
                      <div>{listing.title}</div>
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
      )}
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

export default SellerDashboardPage;
