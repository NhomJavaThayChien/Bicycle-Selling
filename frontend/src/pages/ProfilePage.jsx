import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getMyProfile, updateMyProfile } from "../services/userService";

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    avatarUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const data = response.data || null;
        setProfile(data);
        setFormData({
          fullName: data?.fullName || "",
          phoneNumber: data?.phoneNumber || "",
          address: data?.address || "",
          avatarUrl: data?.avatarUrl || "",
        });
      } catch {
        setError("Khong tai duoc profile cua ban.");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateMyProfile(formData);
      setProfile(response.data || null);
      setMessage("Cap nhat profile thanh cong.");
    } catch (submitError) {
      setError(submitError?.response?.data?.message || "Khong the cap nhat profile luc nay.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="content-wrap profile-layout">
      <section className="hero-card profile-hero">
        <div className="profile-avatar">
          {profile?.avatarUrl ? <img src={profile.avatarUrl} alt={profile.fullName || user?.username} /> : <span>{(profile?.fullName || user?.username || "U").charAt(0)}</span>}
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Your account</p>
          <h1>{profile?.fullName || user?.username || "Profile"}</h1>
          <p>Role: {user?.role || profile?.role || "USER"}</p>
          <div className="stat-row">
            <div><strong>{profile?.reputationScore?.toFixed ? profile.reputationScore.toFixed(1) : profile?.reputationScore || 0}</strong><span>Reputation</span></div>
            <div><strong>{profile?.totalReviews ?? 0}</strong><span>Reviews</span></div>
            <div><strong>{profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString("vi-VN") : "-"}</strong><span>Last login</span></div>
          </div>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      <section className="panel-card">
        <div className="section-heading">
          <h2>Edit profile</h2>
          <p>Update contact details and avatar for a cleaner storefront presence.</p>
        </div>

        <form className="form-grid profile-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input name="fullName" value={formData.fullName} onChange={handleChange} />
          </label>
          <label>
            <span>Phone number</span>
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </label>
          <label className="full-span">
            <span>Address</span>
            <input name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label className="full-span">
            <span>Avatar URL</span>
            <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />
          </label>

          <div className="full-span form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
