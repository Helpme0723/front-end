import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signUp,
  checkEmailAvailability,
  sendVerificationEmail,
  verifyEmailCode,
} from '../apis/auth';
import '../styles/Pages.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    try {
      await checkEmailAvailability(email);
      setEmailChecked(true);
      setSignUpMessage('사용 가능한 이메일입니다.');
    } catch (error) {
      setEmailChecked(false);
      setSignUpMessage(error.message);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendVerificationEmail(email);
      setEmailChecked(true);
      setSignUpMessage('인증번호가 이메일로 전송되었습니다.');
    } catch (error) {
      setSignUpMessage(error.message);
    }
  };

  const handleVerifyEmailCode = async () => {
    try {
      await verifyEmailCode(email, verificationCode);
      setEmailVerified(true);
      setSignUpMessage('이메일 인증 성공');
    } catch (error) {
      setEmailVerified(false);
      setSignUpMessage(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setSignUpMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!emailChecked) {
      setSignUpMessage('이메일 중복 검사를 먼저 해주세요.');
      return;
    }

    if (!emailVerified) {
      setSignUpMessage('이메일 인증을 완료해주세요.');
      return;
    }

    try {
      await signUp({ email, password, passwordConfirm, nickname });
      setSignUpMessage('회원가입에 성공했습니다.');
      setTimeout(() => {
        navigate('/'); // 메인 페이지로 리디렉션
      }, 1000);
    } catch (error) {
      setSignUpMessage(`회원가입 실패: ${error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      {signUpMessage && (
        <div
          className={`signup-message ${
            signUpMessage.includes('성공') ||
            signUpMessage.includes('사용') ||
            signUpMessage.includes('전송')
              ? 'success'
              : 'error'
          }`}
        >
          {signUpMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>이메일</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleCheckEmail}
              className="check-email-button"
            >
              이메일 중복 검사
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>인증번호</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="인증번호를 입력해주세요"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleVerifyEmailCode}
              className="verify-email-button"
            >
              인증번호 확인
            </button>
            <button
              type="button"
              onClick={handleSendVerificationEmail}
              className="send-email-button"
            >
              인증번호 받기
            </button>
          </div>
        </div>
        <div className="input-group">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>닉네임</label>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUp;
