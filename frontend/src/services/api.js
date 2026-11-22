import axios from "axios";

const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const api = axios.create({ baseURL: `${base}/api`, timeout: 30000 });

export const setToken = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

// When a session ends, send the official back to the sign-in page.
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401 && window.location.pathname.startsWith("/admin") && !String(err.config?.url).includes("/auth/")) {
    try { sessionStorage.removeItem("dwda-admin-token"); } catch { /* ignore */ }
    if (window.location.pathname !== "/admin/login") window.location.assign("/admin/login?expired=1");
  }
  return Promise.reject(err);
});

// A readable message and per-field errors from any API failure.
export const errorInfo = (err) => {
  if (!err?.response) return { message: "We couldn't reach the server. Check that the backend is running and try again.", fields: {} };
  return { message: err.response.data?.message || "Something went wrong. Try again.", fields: err.response.data?.errors || {} };
};

export const fileUrl = (path) => `${base}/api${path}`;

export default api;
