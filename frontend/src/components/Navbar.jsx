import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand-mark">
        BikeMarket
      </Link>

      <nav className="topbar-links">
        <NavLink to="/bikes" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Bikes
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Wishlist
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Orders
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Profile
        </NavLink>
        {user?.role === "SELLER" && (
          <NavLink to="/seller/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Seller dashboard
          </NavLink>
        )}
      </nav>

      <div className="topbar-actions">
        {isAuthenticated ? (
          <>
            <span className="topbar-chip">{user?.username}</span>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="ghost-button link-button">
              Login
            </Link>
            <Link to="/register" className="primary-button link-button">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
