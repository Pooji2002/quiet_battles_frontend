import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT to protected API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("qbAccessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;