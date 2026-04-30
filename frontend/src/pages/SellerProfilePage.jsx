import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile } from "../services/userService";
import { getListings } from "../services/bikeService";
import { getReviewsBySeller } from "../services/reviewService";
import { formatPrice } from "../utils/formatPrice";

function SellerProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadSellerProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileRes, listingsRes, reviewsRes] = await Promise.all([
          getUserProfile(userId),
          getListings({ page: 0, size: 200 }),
          getReviewsBySeller(userId, { page: 0, size: 20 }),
        ]);

        const allListings = Array.isArray(listingsRes.data?.content)
          ? listingsRes.data.content
          : [];

        setProfile(profileRes.data || null);
        setListings(
          allListings.filter((item) => String(item.sellerId) === String(userId)),
        );
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      } catch {
        setError("Khong tai duoc thong tin seller.");
        setProfile(null);
        setListings([]);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadSellerProfile();
  }, [userId]);

  const reviewScore = useMemo(() => {
    if (!profile?.reputationScore) {
      return "0.0";
    }
    return Number(profile.reputationScore).toFixed(1);
  }, [profile?.reputationScore]);

  if (loading) {
    return <main style={pageStyle}><p>Dang tai seller profile...</p></main>;
  }

  return (
    <main style={pageStyle}>
      {error && <div style={errorBoxStyle}>{error}</div>}

      <section style={heroStyle}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={avatarStyle}>
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.fullName} style={avatarImgStyle} />
            ) : (
              <span>{profile?.fullName?.charAt(0) || "S"}</span>
            )}
          </div>
          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Seller Profile</p>
            <h1 style={{ margin: "4px 0" }}>{profile?.fullName || "Seller"}</h1>
            <p style={{ margin: "4px 0" }}>Reputation: {reviewScore}</p>
            <p style={{ margin: "4px 0" }}>Total reviews: {profile?.totalReviews ?? 0}</p>
            <p style={{ margin: "4px 0" }}>Member since: {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString("vi-VN") : "-"}</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <h2 style={{ margin: 0 }}>Active Listings</h2>
          <Link to="/bikes">Browse more bikes</Link>
        </div>

        {listings.length === 0 ? (
          <p>Seller chua co listing nao.</p>
        ) : (
          <div style={listingGridStyle}>
            {listings.map((item) => (
              <article key={item.id} style={cardStyle}>
                {item.primaryImageUrl && (
                  <img src={item.primaryImageUrl.startsWith("/uploads") ? `http://localhost:8080${item.primaryImageUrl}` : item.primaryImageUrl} alt={item.title} style={cardImageStyle} />
                )}
                <div style={{ padding: "12px" }}>
                  <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                  <p style={{ margin: "6px 0" }}>{formatPrice(Number(item.price || 0))}</p>
                  <p style={{ margin: "6px 0", color: "#64748b" }}>{item.status}</p>
                  <Link to={`/bikes/${item.id}`}>View detail</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ margin: 0 }}>Danh gia tu nguoi mua</h2>
        {reviews.length === 0 ? (
          <div
            style={{
              marginTop: "12px",
              padding: "24px",
              borderRadius: "16px",
              background: "#f8fafc",
              color: "#667085",
              textAlign: "center",
            }}
          >
            Chua co danh gia nao.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            {reviews.map((review) => (
              <article key={review.id} style={reviewCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <strong style={{ fontSize: "1rem" }}>
                    {review?.reviewer?.username || "Nguoi dung an danh"}
                  </strong>
                  <span style={{ color: "#f59e0b", fontWeight: 800 }}>
                    ⭐ {review.rating}/5
                  </span>
                </div>
                <p style={{ marginTop: "10px", color: "#475467", lineHeight: 1.6 }}>
                  {review.comment || "Nguoi dung khong de lai nhan xet."}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const pageStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px 16px 40px",
};

const heroStyle = {
  borderRadius: "20px",
  padding: "24px",
  background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
  color: "white",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
};

const avatarStyle = {
  width: "92px",
  height: "92px",
  borderRadius: "999px",
  backgroundColor: "rgba(255,255,255,0.16)",
  display: "grid",
  placeItems: "center",
  fontSize: "2rem",
  fontWeight: 800,
  overflow: "hidden",
  flexShrink: 0,
};

const avatarImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const listingGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  marginTop: "16px",
};

const cardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: "white",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
};

const cardImageStyle = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
};

const errorBoxStyle = {
  marginBottom: "14px",
  border: "1px solid #fecdca",
  backgroundColor: "#fef3f2",
  color: "#b42318",
  borderRadius: "10px",
  padding: "10px 12px",
};

const reviewCardStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  backgroundColor: "#fff",
  padding: "18px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
};

export default SellerProfilePage;
