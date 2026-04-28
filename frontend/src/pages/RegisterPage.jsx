import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    role: "BUYER",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(formData);
      navigate("/profile");
    } catch (submitError) {
      setError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page-register">
      <div className="auth-card auth-card-register">
        <div className="register-intro">
          <p className="simple-auth-kicker">Bicycle Selling</p>
          <h1>Đăng ký tài khoản</h1>
          <p>
            Tạo hồ sơ mua hoặc bán xe đạp trong vài bước, bố cục rõ ràng và dễ
            theo dõi hơn.
          </p>
        </div>

        <form className="auth-form register-form" onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              minLength={3}
              placeholder="Nhập username"
              required
            />
          </label>

          <label htmlFor="fullName">
            Họ tên
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              required
            />
          </label>

          <label htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </label>

          <label htmlFor="phoneNumber">
            Số điện thoại
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </label>

          <label htmlFor="password">
            Mật khẩu
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              minLength={6}
              required
            />
          </label>

          <label htmlFor="role">
            Vai trò
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="BUYER">Người mua</option>
              <option value="SELLER">Người bán</option>
            </select>
          </label>

          {error && <p className="form-error full-span">{error}</p>}

          <button
            type="submit"
            className="primary-button full-width"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="register-note">
          <span>Gợi ý:</span> điền thông tin theo từng dòng để dễ kiểm tra và
          chỉnh sửa hơn trên máy tính lẫn điện thoại.
        </div>

        <p className="auth-footnote">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
