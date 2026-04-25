import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === ĐOẠN CODE QUAN TRỌNG ĐỂ CHUYỂN TRANG ĐÚNG ===
  // useEffect sẽ tự động chạy ngay khi biến 'isAuthenticated' hoặc 'user' thay đổi
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || "").toUpperCase();
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Chỉ gọi hàm login, việc chuyển trang để useEffect ở trên lo
      await login(formData);
    } catch (submitError) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page-simple">
      <div className="auth-card auth-card-simple">
        <div className="simple-auth-header">
          <p className="simple-auth-kicker">Bicycle Selling</p>
          <h1>Đăng nhập</h1>
          <p>Vui lòng nhập tài khoản để tiếp tục.</p>
        </div>

        <form className="auth-form simple-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="usernameOrEmail">Username hoặc email</label>
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="Nhập username hoặc email"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
            autoComplete="current-password"
            required
          />

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="primary-button full-width"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="auth-footnote simple-auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
