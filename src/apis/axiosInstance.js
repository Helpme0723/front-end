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
        const { accessToken, refreshToken } = await refreshAccessToken();
        localStorage.setItem('accessToken', accessToken); // 새로운 엑세스 토큰 저장
        localStorage.setItem('refreshToken', refreshToken); // 새로운 리프레시 토큰 저장
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
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
