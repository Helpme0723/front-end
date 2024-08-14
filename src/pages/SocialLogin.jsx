import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socialLogin } from '../apis/auth';
import AuthContext from '../context/AuthContext';

const SocialLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleNaverLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const data = await socialLogin(code);

          console.log('소셜 로그인 성공:', data);

          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);

          login(data.data.accessToken, data.data.refreshToken);

          navigate('/');
        } catch (error) {
          console.error('소셜 로그인 오류:', error.message);
        }
      }
    };

    handleNaverLogin();
  }, [navigate]);

  return <div>소셜 로그인 중...</div>;
};

export default SocialLogin;
