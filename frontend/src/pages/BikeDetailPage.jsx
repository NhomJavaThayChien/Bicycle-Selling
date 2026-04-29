import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getListingById } from "../services/bikeService";
import { createOrGetConversation } from "../services/chatService";
import { getReviewsBySeller } from "../services/reviewService";
import {
  addToWishlistApi,
  fetchWishlist,
  isInWishlist,
  removeFromWishlistApi,
} from "../services/wishlistService";
import { formatPrice } from "../utils/formatPrice";

const conditionMap = {
  NEW: "Mới 100%",
  LIKE_NEW: "Như mới",
  GOOD: "Tốt",
  FAIR: "Khá",
  POOR: "Cũ",
};

const inspectionMap = {
  PASSED: "ĐẠT",
  FAILED: "KHÔNG ĐẠT",
  REQUESTED: "ĐANG CHỜ",
};

function BikeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const defaultImage = "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800";
  const [selectedImage, setSelectedImage] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleImgError = () => {
    if (selectedImage !== defaultImage) {
      setSelectedImage(defaultImage);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setLoadError("");
      setActionError("");
      try {
        const response = await getListingById(id);
        const data = response.data;
        setListing(data);
        const initialImg = data?.primaryImageUrl || data?.imageUrls?.[0] || defaultImage;
        setSelectedImage(initialImg);
        const wishlistItems = await fetchWishlist();
        setWishlisted(
          wishlistItems.some((item) => item.id === data.id) ||
            isInWishlist(data.id),
        );
      } catch {
        setLoadError("Failed to load listing detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();

  }, [id]);

  useEffect(() => {
    if (!listing?.sellerId) {
      setReviews([]);
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await getReviewsBySeller(listing.sellerId, {
          page: 0,
          size: 20,
        });
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch {
        setReviews([]);
      }
    };

    fetchReviews();
  }, [listing?.sellerId]);

  const galleryImages = useMemo(() => {
    if (!listing) {
      return [];
    }

    const source = listing.imageUrls?.length ? listing.imageUrls : [];
    if (source.length > 0) {
      return source;
    }

    return listing.primaryImageUrl ? [listing.primaryImageUrl] : [];
  }, [listing]);

  const handleToggleWishlist = async () => {
    if (!listing) {
      return;
    }

    if (wishlisted) {
      await removeFromWishlistApi(listing.id);
      setWishlisted(false);
      return;
    }

    await addToWishlistApi(listing);
    setWishlisted(true);
  };

  const handleContactSeller = async () => {
    if (!listing) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (Number(user?.userId) === Number(listing.sellerId)) {
      setActionError("Ban dang xem bai dang cua chinh minh.");
      return;
    }

    try {
      setCreatingConversation(true);
      setActionError("");

      const response = await createOrGetConversation({
        otherUserId: listing.sellerId,
        listingId: listing.id,
        otherUsername: listing.sellerUsername,
      });

      navigate(`/chat/${response.conversationId}`);
    } catch {
      setActionError("Khong the tao hoi thoai luc nay.");
    } finally {
      setCreatingConversation(false);
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${listing.id}`);
  };

  if (loading) {
    return (
      <div className="bike-detail-container">
        <div className="bike-detail-layout">
          <div className="bike-gallery">
            <div className="main-image-container skeleton" style={{ height: '450px' }}></div>
            <div className="thumbnail-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="thumbnail-btn skeleton"></div>
              ))}
            </div>
          </div>
          <div className="bike-info-section">
            <div className="skeleton" style={{ height: '48px', width: '80%', marginBottom: '16px' }}></div>
            <div className="skeleton" style={{ height: '40px', width: '40%', marginBottom: '24px' }}></div>
            <div className="bike-badges">
              {[1, 2].map(i => (
                <div key={i} className="badge-detail skeleton" style={{ width: '100px', height: '32px' }}></div>
              ))}
            </div>
            <div className="skeleton" style={{ height: '120px', width: '100%', marginBottom: '40px' }}></div>
            <div className="action-buttons">
              <div className="action-btn skeleton"></div>
              <div className="action-btn skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !listing) {
    return (
      <div className="bike-detail-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#b42318' }}>Oops! Không tìm thấy thông tin</h2>
        <p style={{ color: '#667085' }}>{loadError || "Chiếc xe này có thể đã bị gỡ hoặc không tồn tại."}</p>
        <button className="primary-button" onClick={() => navigate('/bikes')} style={{ marginTop: '20px' }}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const specs = [
    ["Kích thước khung", listing.frameSize],
    ["Chất liệu khung", listing.frameMaterial],
    ["Kích thước bánh", listing.wheelSize],
    ["Loại phanh", listing.brakeType],
    ["Hệ thống truyền động", listing.gearSystem],
    ["Năm sản xuất", listing.yearOfManufacture],
    ["Màu sắc", listing.color],
    ["Trọng lượng", listing.weight ? `${listing.weight} kg` : null],
    ["Khu vực", listing.location],
  ].filter((item) => item[1]);

  return (
    <div className="bike-detail-container">
      <div className="bike-detail-layout">
        <section className="bike-gallery">
          <div className="main-image-container">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={listing.title}
                className="main-image"
                onError={handleImgError}
              />
            ) : (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
                <p style={{ color: '#94a3b8' }}>Không có hình ảnh</p>
              </div>
            )}
          </div>

          <div className="thumbnail-list">
            {galleryImages.map((image) => (
              <button
                key={image}
                type="button"
                className={`thumbnail-btn ${selectedImage === image ? "active" : ""}`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt="thumbnail" />
              </button>
            ))}
          </div>
        </section>

        <section className="bike-info-section">
          <h1>{listing.title}</h1>
          <p className="bike-detail-price">
            {formatPrice(Number(listing.price || 0))}
          </p>

          <div className="bike-badges">
            {listing.inspectionStatus && (
              <span className="badge-detail badge-inspected">
                ✓ Đã kiểm định: {inspectionMap[listing.inspectionStatus] || listing.inspectionStatus}
              </span>
            )}
            {listing.condition && (
              <span className="badge-detail badge-condition">
                Tình trạng: {conditionMap[listing.condition] || listing.condition}
              </span>
            )}
            {listing.status && (
              <span className="badge-detail badge-status">
                {listing.status === 'APPROVED' ? 'Đang bán' : listing.status}
              </span>
            )}
          </div>

          <div className="bike-description">
            <p>{listing.description}</p>
          </div>

          <div className="action-buttons">
            <button className="action-btn btn-buy" onClick={handleBuyNow}>
              Mua ngay
            </button>
            <button className="action-btn btn-contact" onClick={handleContactSeller} disabled={creatingConversation}>
              {creatingConversation ? "Đang kết nối..." : "Nhắn tin cho người bán"}
            </button>
            <button className="action-btn btn-wishlist" onClick={handleToggleWishlist}>
              {wishlisted ? "❤️ Đã lưu vào yêu thích" : "🤍 Thêm vào yêu thích"}
            </button>
          </div>

          {actionError && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {actionError}
            </div>
          )}

          <div className="seller-card">
            <div className="seller-header">
              <div className="seller-avatar">
                {(listing.sellerUsername || "U").charAt(0).toUpperCase()}
              </div>
              <div className="seller-name-info">
                <h4>{listing.sellerFullName || listing.sellerUsername}</h4>
                <div className="seller-reputation">
                  ⭐ {listing.sellerReputation ?? "5.0"} • Người bán uy tín
                </div>
              </div>
            </div>
            <Link to={`/users/${listing.sellerId}/profile`} className="view-seller-profile">
              Xem hồ sơ người bán →
            </Link>
          </div>
        </section>
      </div>

      <section className="specs-section">
        <h2>Thông số kỹ thuật</h2>
        <div className="specs-grid">
          {specs.map(([label, value]) => (
            <div key={label} className="spec-item">
              <span className="spec-label">{label}</span>
              <span className="spec-value">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "60px" }}>
        <h2>Đánh giá từ người mua</h2>
        {reviews.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', color: '#667085' }}>
            Chưa có đánh giá nào cho người bán này.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {reviews.map((review) => (
              <article key={review.id} className="news-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>{review?.reviewer?.username || "Người dùng ẩn danh"}</strong>
                  <span style={{ color: '#fbbf24', fontWeight: 800 }}>⭐ {review.rating}/5</span>
                </div>
                <p style={{ color: '#475467', lineHeight: 1.6, margin: 0 }}>
                  {review.comment || "Người dùng không để lại nhận xét."}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default BikeDetailPage;
