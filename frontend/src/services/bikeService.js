import API from './api';

export const getAllBikes = () => API.get('/bikes');
export const createBike = (data) => API.post('/bikes', data);
