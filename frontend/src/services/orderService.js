import api from "./api";

export const createOrder = (data) => api.post("/orders", data);

export const getBuyerOrders = () => api.get("/orders/buyer");

export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

export const completeOrder = (orderId) => api.put(`/orders/${orderId}/complete`);

export const getSellerOrders = () => api.get("/orders/seller");

export const confirmOrder = (orderId) => api.put(`/orders/${orderId}/confirm`);

export const rejectOrder = (orderId) => api.put(`/orders/seller/${orderId}/reject`);
