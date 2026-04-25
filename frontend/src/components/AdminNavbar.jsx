import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminNavbar({ user, isAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || "").toUpperCase();
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true }); // <--- This is the redirect for admin
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        BIKEMARKET <span style={styles.adminTag}>ADMIN</span>
      </div>

      <div style={styles.links}>
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/categories"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Categories
        </NavLink>

        <NavLink
          to="/admin/brands"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Brands
        </NavLink>

        <NavLink
          to="/admin/approvals"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Approvals
        </NavLink>

        {/* Thêm link Quản lý Tranh chấp */}
        <NavLink
          to="/admin/disputes"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Disputes
        </NavLink>

        {/* Thêm link Quản lý Giao dịch */}
        <NavLink
          to="/admin/transactions"
          style={({ isActive }) =>
            isActive ? { ...styles.link, ...styles.active } : styles.link
          }
        >
          Transactions
        </NavLink>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    background: "#0f172a", // Màu xanh đen đậm luxury
    height: "70px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  logo: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "20px",
    letterSpacing: "1px",
  },

  adminTag: {
    background: "#3b82f6", // Màu xanh dương highlight
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "4px",
    marginLeft: "5px",
    verticalAlign: "middle",
  },

  links: {
    display: "flex",
    gap: "30px",
  },

  link: {
    color: "#94a3b8", // Màu chữ nhạt khi chưa active
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "0.3s",
  },

  active: {
    color: "#fff", // Trắng sáng khi đang ở trang đó
    borderBottom: "2px solid #3b82f6",
    paddingBottom: "5px",
  },
};
