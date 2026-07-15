import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedRequestsQueue = [];

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAuthPage = [
      "/login",
      "/register",
      "/forgot-password",
      "/verify-email",
      "/reset-password",
    ].includes(window.location.pathname);

    if (isAuthPage && originalRequest.url === "/users/me") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          resolve,
          reject,
        });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh", null, {
        skipAuthRefresh: true,
      });

      failedRequestsQueue.forEach(({ resolve }) => resolve());
      failedRequestsQueue = [];

      return api(originalRequest);
    } catch (refreshError) {
      failedRequestsQueue.forEach(({ reject }) => reject(refreshError));

      failedRequestsQueue = [];

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
