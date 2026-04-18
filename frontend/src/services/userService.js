import api from "./api";

export const getMyProfile = () => api.get("/me");

export const updateMyProfile = (data) => api.put("/me/profile", data);

export const getUserProfile = (userId) => api.get(`/users/${userId}/profile`);
