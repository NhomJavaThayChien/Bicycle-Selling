import api from "./api";

export const createCashPayment = (orderId, currency = "vnd") =>
  api.post("/payments/cash", { orderId, currency });

export const createStripePayment = (orderId, currency = "vnd") =>
  api.post("/payments/stripe", { orderId, currency });
