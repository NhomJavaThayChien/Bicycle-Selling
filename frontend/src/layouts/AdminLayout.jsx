import AdminNavbar from "../components/AdminNavbar";

// Chúng ta dùng { children } để nhận nội dung trang Admin truyền vào
export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      {/* Thanh điều hướng Admin luôn cố định ở trên */}
      <AdminNavbar />

      {/* Nội dung các trang Dashboard, Users... sẽ hiển thị ở đây */}
      <div className="admin-content" style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}
