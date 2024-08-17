import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // AuthContext 추가
import { signIn } from '../apis/auth';
import '../styles/pages/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // AuthContext 사용

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const data = await signIn(email, password);
      login(data.data.accessToken, data.data.refreshToken); // 로그인 상태 업데이트
      setMessageType('success');
      setMessage('로그인에 성공했습니다.');
      setTimeout(() => {
        navigate('/'); // 메인 페이지로 리디렉션
      }, 1000); // 1초 (1000밀리초) 후에 메인 페이지로 이동
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  const handleNaverLogin = async () => {
    window.location.href = process.env.REACT_APP_NAVER_SOCIAL_LOGIN;
  };
  const handleKakaoLogin = async () => {
    window.location.href = process.env.REACT_APP_KAKAO_SOCIAL_LOGIN;
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>패스워드</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-me">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">이메일 저장</label>
        </div>
        {message && (
          <div className={`login-message ${messageType}`}>{message}</div>
        )}
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
      <div className="social-login">
        <button className="social-button naver" onClick={handleNaverLogin}>
          네이버
        </button>
        <button className="social-button kakao" onClick={handleKakaoLogin}>
          카카오
        </button>
      </div>
      <div className="additional-links-login">
        <a href="/sign-up">회원가입</a> {/* 회원가입 링크 추가 */}
        <a href="/recover/password">비밀번호 재설정</a>
      </div>
    </div>
  );
}

export default Login;
