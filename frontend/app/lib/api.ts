import axios from "axios";

export const API_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:3000/v1";
export const STORAGE_URL = import.meta.env.VITE_BASE_PUBLIC_OBJECT_STORAGE_URL || "";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Auth ──────────────────────────────────────────────
export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function register(username: string, email: string, password: string) {
  const res = await api.post("/users", { username, email, password });
  return res.data;
}

// ── User ──────────────────────────────────────────────
export async function getMe() {
  const res = await api.get("/users/me");
  return res.data;
}

export async function getAddress() {
  const res = await api.get("/users/address");
  return res.data;
}

export async function saveAddress(district: string, village: string, details: string, isUpdate: boolean = false) {
  if (isUpdate) {
    const res = await api.patch("/users/address", { district, village, details });
    return res.data;
  }
  const res = await api.post("/users/address", { district, village, details });
  return res.data;
}

// ── Oil ───────────────────────────────────────────────
export async function getOilStock() {
  const res = await api.get("/oil");
  return res.data;
}

export async function updateOilStock(delta: number) {
  const res = await api.post("/oil", { delta });
  return res.data;
}

export async function getOilPrice(priceType: "Buy" | "Sell") {
  const res = await api.get("/oil/price", { params: { price_type: priceType } });
  return res.data;
}

export async function updateOilPrice(price: number, priceType: "Buy" | "Sell") {
  const res = await api.post("/oil/price", { price, price_type: priceType });
  return res.data;
}

// ── Transactions ──────────────────────────────────────
export interface CreateTransactionPayload {
  oil_volume: number;
  transaction_type: "Purchase" | "Sale";
  payment_method: "Qris" | "Cod";
  address_district: string;
  address_village: string;
  address_details: string;
  sale_image_url?: string | null;
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const res = await api.post("/transaction", payload);
  return res.data;
}

export async function getAdminTransactions(page: number, pageSize: number) {
  const res = await api.get("/transaction/admin", { params: { page, page_size: pageSize } });
  return res.data;
}

export async function getTransactions(page: number, pageSize: number) {
  const res = await api.get("/transaction", { params: { page, page_size: pageSize } });
  return res.data;
}

export async function getTransactionById(id: number) {
  const res = await api.get(`/transaction/${id}`);
  return res.data;
}

export async function getTransactionDetails(transactionId: number) {
  const res = await api.get(`/transaction/details/${transactionId}`);
  return res.data;
}

export async function getTransactionPayment(transactionId: number) {
  const res = await api.get(`/transaction/payment/${transactionId}`);
  return res.data;
}

export async function updateTransactionStatus(transactionId: number, status: string) {
  const res = await api.patch(`/transaction/status/${transactionId}`, { transaction_status: status });
  return res.data;
}

export async function getUploadUrl(mimeType: string) {
  const res = await api.post("/transaction/upload-url", { mime_type: mimeType });
  return res.data;
}

export function getPaymentUrl(amount: number, orderId: string) {
  return `https://app.pakasir.com/pay/ucob/${amount}?order_id=${orderId}`;
}
