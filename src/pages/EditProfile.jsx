import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo, updateUserInfo } from '../apis/user';
import '../styles/pages/EditProfile.css';

function EditProfile() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    profileUrl: '',
    nickname: '',
    email: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data.data);
      } catch (error) {
        console.error('사용자 정보를 가져오지 못했습니다.', error);
      }
    };

    fetchUserInfo();
  }, [isAuthenticated, navigate]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('nickname', userInfo.nickname);
    formData.append('description', userInfo.description);

    try {
      await updateUserInfo(formData);
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
      setTimeout(() => {
        navigate('/profile');
      }, 1000); // 1초 후에 마이페이지로 이동
    } catch (error) {
      setMessage('프로필 업데이트에 실패했습니다.');
    }
  };
  const handlePasswordChange = () => {
    navigate('/change-password');
  };

  return (
    <div className="edit-profile-container">
      <h2>프로필 수정</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-picture-section">
          <img
            src={userInfo.profileUrl || '/default-profile.png'}
            alt="Profile"
          />
          <label htmlFor="file">프로필 이미지</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>
        <div className="input-group">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={userInfo.nickname}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label>이메일</label>
          <input type="email" name="email" value={userInfo.email} readOnly />
        </div>
        <div className="input-group">
          <label>자기소개</label>
          <textarea
            name="description"
            value={userInfo.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="additional-links-edit">
          <p onClick={handlePasswordChange}>비밀번호 변경</p>
          {/* TODO: 기능 미구현 추후 수정 */}
          <p style={{ pointerEvents: 'none', color: 'grey' }}>알림 설정</p>
          <p style={{ pointerEvents: 'none', color: 'grey' }}>불호 태그 설정</p>
        </div>
        <button type="submit" className="save-button">
          변경사항 저장
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default EditProfile;
