import api from "./api";

// Buyer tạo tranh chấp
export const createDispute = (data) => api.post("/disputes", data);
// { orderId, reason, description, evidenceUrls? }

// Lấy chi tiết 1 tranh chấp
export const getDisputeById = (id) => api.get(`/disputes/${id}`);

// Admin: lấy tất cả
export const getAllDisputes = () => api.get("/disputes");

// Admin: nhận xử lý
export const takeDispute = (id) => api.put(`/disputes/${id}/take`);

// Admin: phán quyết
export const resolveDispute = (id, data) => api.put(`/disputes/${id}/resolve`, data);
// { resolution: string }

// Admin: đóng
export const closeDispute = (id) => api.put(`/disputes/${id}/close`);

// Buyer: lấy danh sách ID các đơn hàng đã tranh chấp
export const getMyDisputedOrderIds = () => api.get("/disputes/mine");

// Lấy tranh chấp theo Order ID (dùng cho cả Seller và Buyer)
export const getDisputeByOrderId = (orderId) => api.get(`/disputes/order/${orderId}`);
