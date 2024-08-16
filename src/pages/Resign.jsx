import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { resign } from '../apis/auth';
import '../styles/pages/Resign.css';

const Resign = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logout } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인 이후 회원탈퇴할 수 있습니다.');
      navigate('/login');
      return;
    }
  }, [isAuthenticated]);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await resign(email, password);

      alert('회원탈퇴를 했습니다.');
      logout();
      navigate('/');
      return;
    } catch (error) {
      setMessage(error.response?.data?.message || '회원탈퇴에 실패했습니다.');

      console.log(error);
    }
  };

  return (
    <div className="resign-form-wrapper">
      <div className="resign-form-container">
        <form onSubmit={handleSubmit} className="resign-withdrawal-form">
          <h2>회원탈퇴</h2>
          <div className="resign-form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="resign-form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {message && <div className="resign-message">{message}</div>}
          <button type="submit" className="resign-submit-button">
            회원탈퇴
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resign;
