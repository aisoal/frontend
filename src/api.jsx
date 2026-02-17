import axios from "axios";

let baseUrl = "http://localhost:7645/api";

if (
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
) {
  baseUrl = "http://localhost:7645/api";
} else {
  baseUrl = `${window.location.origin}/api`;
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
