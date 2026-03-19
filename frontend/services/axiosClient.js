import axios from "axios";

// Khởi tạo instance của Axios
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR: Can thiệp trước khi gửi request lên server
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
    const token = localStorage.getItem("jwt_token");

    // Nếu có token, đính kèm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 2. RESPONSE INTERCEPTOR: Can thiệp sau khi nhận kết quả từ server
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp phần data theo chuẩn JSON của dự án (success, message, data)
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý các mã lỗi HTTP phổ biến
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // 401 Unauthorized: Token hết hạn hoặc chưa đăng nhập
      console.error("Unauthorized! Chuyển hướng về trang đăng nhập...");
      localStorage.removeItem("jwt_token");
      window.location.href = "/login"; // Cẩn thận: Dùng window.location sẽ reload lại trang
    } else if (status === 403) {
      // 403 Forbidden: Không có quyền truy cập (vd: Buyer cố vào trang Admin)
      console.error("Forbidden! Bạn không có quyền truy cập.");
      // Có thể chuyển hướng về trang /403
    } else if (status === 404) {
      // 404 Not Found: Không tìm thấy tài nguyên
      console.error("Not Found!");
    } else if (status === 500) {
      // 500 Internal Server Error: Lỗi server backend
      console.error("Lỗi hệ thống từ Backend!");
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
