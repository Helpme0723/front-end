import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../apis/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('accessToken')
  );
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    // 사용자 정보 가져오기
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me');
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user info:', error);
        logout(); // 오류가 발생하면 로그아웃 처리
      }
    };

    if (token) {
      fetchUserId();
    }
  }, []);

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsAuthenticated(true);

    // 사용자 정보 갱신
    try {
      const response = await axiosInstance.get('/api/users/me');
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching user info:', error);
      logout(); // 오류가 발생하면 로그아웃 처리
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
