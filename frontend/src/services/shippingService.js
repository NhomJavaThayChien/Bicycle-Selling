import api from "./api";

export const getProvinces = () => api.get("/shipping/provinces");

export const getDistricts = (provinceId) =>
  api.get(`/shipping/districts/${provinceId}`);

export const getWards = (districtId) => api.get(`/shipping/wards/${districtId}`);

export const calculateShippingFee = ({
  listingId,
  fromDistrictId,
  fromWardCode,
  toDistrictId,
  toWardCode,
}) =>
  api.get("/shipping/fee", {
    params: {
      listingId,
      fromDistrictId,
      fromWardCode,
      toDistrictId,
      toWardCode,
    },
  });
