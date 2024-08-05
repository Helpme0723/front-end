import axios from 'axios';
import { refreshAccessToken, logoutUser } from './auth'; // auth.js에서 함수 불러오기

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // API 서버의 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
