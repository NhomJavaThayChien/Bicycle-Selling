import React from "react";
import AdminSidebar from "../components/AdminSidebar"; // Cập nhật đường dẫn
import AdminHeader from "../components/AdminHeader"; // Cập nhật đường dẫn

export default function AdminLayout({ children }) {
  return (
    <div style={styles.container}>
      {/* Cột trái: Sidebar */}
      <AdminSidebar />

      {/* Cột phải: Header và Nội dung chính */}
      <div style={styles.mainWrapper}>
        <AdminHeader />

        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    backgroundColor: "#f4f7f6",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};
