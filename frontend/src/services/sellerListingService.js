import api from "./api";

export const getMyListings = () => api.get("/seller/listings");

export const createListing = (payload) => api.post("/seller/listings", payload);

export const updateListing = (id, payload) =>
  api.put(`/seller/listings/${id}`, payload);

export const deleteListing = (id) => api.delete(`/seller/listings/${id}`);

export const getListingDetail = (id) => api.get(`/listings/${id}`);

export const uploadListingImages = (listingId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return api.post(`/seller/listings/${listingId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
