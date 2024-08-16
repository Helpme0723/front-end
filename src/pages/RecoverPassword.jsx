import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo } from '../apis/user';
import { recoverPassword, sendVerificationEmail } from '../apis/auth';
import '../styles/pages/RecoverPassword.css';

const RecoverPassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [verifyCode, setVerifyCode] = useState();
  const [isEmailEditable, setIsEmailEditable] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const response = await getUserInfo();

          setEmail(response.data.email);
          setIsEmailEditable(false);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  const handleSendVerificationCode = async () => {
    try {
      const response = await sendVerificationEmail(email);

      alert('인증번호를 발송했습니다.');
    } catch (error) {
      console.error('이메일 전송 실패', error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await recoverPassword(
        email,
        password,
        passwordConfirm,
        Number(verifyCode),
      );

      alert('비밀번호를 재설정했습니다.');
      navigate('');
    } catch (error) {
      console.error('비밀번호 재설정 실패', error);
    }
  };

  return (
    <div className="recover-password-container">
      <h2 className="recover-password-title">비밀번호 재설정</h2>
      <form onSubmit={handleSubmit} className="recover-password-form">
        <div className="recover-password-input-group">
          <label className="recover-password-label">이메일</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!isEmailEditable} // 로그인한 유저는 이메일 수정 불가
            className="recover-password-input"
            placeholder="이메일을 입력해주세요"
          />
          <button
            type="button"
            onClick={handleSendVerificationCode}
            disabled={!email} // 이메일이 없을 때는 버튼 비활성화
            className="recover-password-button"
          >
            인증번호 발송
          </button>
        </div>

        <div className="recover-password-input-group">
          <label className="recover-password-label">인증번호</label>
          <input
            type="number"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            required
            className="recover-password-input"
            placeholder="인증번호를 입력해주세요"
          />
        </div>

        <div className="recover-password-input-group">
          <label className="recover-password-label">새 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="recover-password-input"
            placeholder="새 비밀번호를 입력해주세요"
          />
        </div>

        <div className="recover-password-input-group">
          <label className="recover-password-label">비밀번호 확인</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            required
            className="recover-password-input"
            placeholder="비밀번호를 다시 입력해주세요"
          />
        </div>

        <button type="submit" className="recover-password-submit-button">
          재설정
        </button>
      </form>
    </div>
  );
};

export default RecoverPassword;
