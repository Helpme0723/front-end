import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { updateUserPassword } from '../apis/user';
import '../styles/pages/ChangePassword.css';

function ChangePassword() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  if (!isAuthenticated) {
    alert('로그인이 필요합니다.');
    navigate('/');
    return null;
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await updateUserPassword({ password, passwordConfirm });
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setIsError(false);
      setTimeout(() => {
        navigate('/edit-profile');
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
      );
      setIsError(true);
    }
  };

  const handleCancel = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="change-password-container">
      <h2>비밀번호 변경</h2>
      <form onSubmit={handlePasswordChange} className="change-password-form">
        <div className="input-group">
          <label>새 비밀번호</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="change-button">
            비밀번호 변경
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </form>
      {message && (
        <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>
      )}
    </div>
  );
}

export default ChangePassword;
