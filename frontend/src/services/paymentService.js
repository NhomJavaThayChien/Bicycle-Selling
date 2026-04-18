import api from "./api";

export const createCashPayment = (orderId, currency = "vnd") =>
  api.post("/payments/cash", { orderId, currency });

export const createDepositPayment = (orderId, currency = "vnd") =>
  api.post("/payments/deposit", { orderId, currency });

export const createFullPayment = (orderId, currency = "vnd") =>
  api.post("/payments/full-paid", { orderId, currency });
