// src/utils/apiClient.js
import axios from "axios";


const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
const normalizedBackendUrl = backendUrl.replace(/\/$/, "");
const baseURL = normalizedBackendUrl
  ? (normalizedBackendUrl.endsWith("/api") ? normalizedBackendUrl : `${normalizedBackendUrl}/api`)
  : "/api";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ccps-token"); // or context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("ccps-token");
      localStorage.removeItem("ccps-user");
      // Add a slight delay to ensure localstorage is flushed before navigating
      setTimeout(() => {
        window.location.replace("/login");
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
