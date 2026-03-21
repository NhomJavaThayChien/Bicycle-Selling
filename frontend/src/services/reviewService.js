import API from './api';

export const getReviewsByBikeId = (bikeId) => API.get(`/reviews/bike/${bikeId}`);
export const createReview = (data) => API.post('/reviews', data);
