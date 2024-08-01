import axios from 'axios';
import Cookies from 'js-cookie';

const accessToken = Cookies.get('accessToken');

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // API 서버의 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
