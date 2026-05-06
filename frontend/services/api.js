import axios from "axios";

import { getToken } from "@/services/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const fetchVendors = () => api.get("/vendors");
export const createProcurement = (payload) => api.post("/procurement/create", payload);
export const fetchProcurements = () => api.get("/procurement");
export const fetchDecision = (id) => api.get(`/procurement/decision/${id}`);
export const fetchAnalytics = () => api.get("/analytics");

export default api;
