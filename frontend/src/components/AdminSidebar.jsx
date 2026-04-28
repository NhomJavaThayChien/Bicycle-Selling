import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside style={styles.sidebar}>
      {/* Logo Area */}
      <div style={styles.logoContainer}>
        <span style={styles.logoText}>Architect</span>{" "}
        {/* Bạn có thể đổi lại thành BIKEMARKET */}
      </div>

      {/* Menu Area */}
      <div style={styles.menuContainer}>
        <div style={styles.menuGroup}>TỔNG QUAN</div>
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Bảng điều khiển
        </NavLink>

        {/* === NÚT THỐNG KÊ MỚI THÊM VÀO ĐÂY === */}
        <NavLink
          to="/admin/statistics"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Thống kê
        </NavLink>

        <div style={styles.menuGroup}>QUẢN LÝ</div>
        <NavLink
          to="/admin/users"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Người dùng
        </NavLink>
        <NavLink
          to="/admin/categories"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Thể loại
        </NavLink>
        <NavLink
          to="/admin/brands"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Nhãn hiệu
        </NavLink>

        <div style={styles.menuGroup}>HOẠT ĐỘNG</div>
        <NavLink
          to="/admin/approvals"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Phê duyệt
        </NavLink>
        <NavLink
          to="/admin/disputes"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Tranh chấp
        </NavLink>
        <NavLink
          to="/admin/transactions"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.activeLink } : styles.link
          }
        >
          Giao dịch
        </NavLink>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    zIndex: 10,
  },
  logoContainer: {
    height: "60px",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #eee",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "bold",
    fontStyle: "italic", // Giống font chữ Architect trong ảnh
    color: "#333",
  },
  menuContainer: {
    padding: "20px 0",
    overflowY: "auto",
  },
  menuGroup: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#a1a1aa",
    padding: "10px 20px 5px",
    marginTop: "10px",
  },
  link: {
    display: "block",
    padding: "10px 20px",
    color: "#52525b",
    textDecoration: "none",
    fontSize: "14px",
    transition: "background 0.2s, color 0.2s",
  },
  activeLink: {
    backgroundColor: "#eff6ff", // Màu nền xanh nhạt khi active
    color: "#2563eb", // Chữ màu xanh đậm
    borderRight: "3px solid #2563eb",
  },
};
