import api from './api';

export const getListings = (params = {}) => {
	const query = {
		keyword: params.keyword || undefined,
		condition: params.condition || undefined,
		priceMin: params.priceMin || undefined,
		priceMax: params.priceMax || undefined,
		sortBy: params.sortBy || 'createdAt',
		sortDir: params.sortDir || 'desc',
		page: params.page ?? 0,
		size: params.size ?? 200,
	};

	return api.get('/listings', { params: query });
};

export const getListingById = (id) => api.get(`/listings/${id}`);
