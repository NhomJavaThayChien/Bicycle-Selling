import api from "./api";

export const createOrder = (data) => api.post("/orders", data);

export const getBuyerOrders = () => api.get("/orders/buyer");

export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
