import axios from "axios";

const API_URL = "http://localhost:8080/api/inspections";

// Hàm cấu hình Header có chứa Token
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Đảm bảo key này khớp với lúc bạn lưu token khi login
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const inspectionService = {
  // GET /api/inspections (Dành cho Dashboard của Inspector/Admin)
  getAll: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  // GET /api/inspections/{reportId} (Lấy chi tiết để hiển thị trong Form)
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },

  // PUT /api/inspections/{reportId}/submit (Nộp kết quả kiểm định)
  submit: async (id, data) => {
    const response = await axios.put(
      `${API_URL}/${id}/submit`,
      data,
      getAuthHeader(),
    );
    return response.data;
  },

  // PUT /api/inspections/{reportId}/cancel (Dành cho Seller)
  cancel: async (id) => {
    const response = await axios.put(
      `${API_URL}/${id}/cancel`,
      {},
      getAuthHeader(),
    );
    return response.data;
  },
};
