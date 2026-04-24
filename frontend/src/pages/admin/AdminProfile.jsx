import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getMyProfile, updateMyProfile } from "../../services/userService";

export default function AdminProfile() {
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
        setError("Không tải được hồ sơ của bạn.");
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
      setMessage("Cập nhật hồ sơ thành công.");
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          "Không thể cập nhật hồ sơ lúc này.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Hồ sơ cá nhân</h2>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatarPlaceholder}>
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                style={styles.avatarImg}
              />
            ) : (
              <span>
                {(profile?.fullName || user?.username || "A")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 style={styles.name}>
              {profile?.fullName || user?.username || "Admin"}
            </h3>
            <p style={styles.role}>Vai trò: {user?.role || "ADMIN"}</p>
          </div>
        </div>

        {error && (
          <div
            style={{
              ...styles.alert,
              backgroundColor: "#fee2e2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}
        {message && (
          <div
            style={{
              ...styles.alert,
              backgroundColor: "#dcfce3",
              color: "#166534",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Họ và tên</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Số điện thoại</label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Địa chỉ</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Đường dẫn ảnh đại diện (Avatar URL)
            </label>
            <input
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "20px 0" },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  avatarPlaceholder: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  name: { fontSize: "20px", margin: "0 0 5px 0", color: "#0f172a" },
  role: { margin: 0, color: "#64748b", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#475569" },
  input: {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    width: "150px",
  },
  alert: {
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};
