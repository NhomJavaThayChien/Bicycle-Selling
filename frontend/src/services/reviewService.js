import api from "./api";

export const createReview = (orderId, data) =>
	api.post(`/reviews/orders/${orderId}`, data);

export const getReviewsBySeller = (sellerId, params = {}) =>
	api.get(`/reviews/sellers/${sellerId}`, {
		params: {
			page: params.page ?? 0,
			size: params.size ?? 10,
		},
	});

export const getMyReviewedOrderIds = () => api.get("/reviews/mine");
