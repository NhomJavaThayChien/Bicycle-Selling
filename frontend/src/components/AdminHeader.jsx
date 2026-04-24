import React from "react";
// Import Menu vừa tạo
import AdminUserMenu from "./AdminUserMenu";
import NotificationBell from "../pages/Inspector/NotificationBell";

export default function AdminHeader() {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          style={styles.searchInput}
        />
      </div>

      <div style={styles.right}>
        {/* CHUÔNG THÔNG BÁO XỊN */}
        <NotificationBell />

        <div style={styles.icon}>⚙️</div>

        {/* THANH MENU TÀI KHOẢN XỊN (Thay thế cho profile cũ) */}
        <AdminUserMenu />
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "60px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    zIndex: 9,
  },
  left: { display: "flex", alignItems: "center" },
  searchInput: {
    padding: "8px 15px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    outline: "none",
    width: "250px",
    backgroundColor: "#f8fafc",
  },
  right: { display: "flex", alignItems: "center", gap: "20px" },
  icon: { fontSize: "18px", cursor: "pointer", color: "#64748b" },
};
