import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo } from '../apis/user';
import '../styles/Pages.css';

function Profile() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

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

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-picture">
          <img
            src={userInfo.profileUrl || '/default-profile.png'}
            alt="Profile"
          />
        </div>
        <div className="profile-details">
          <h3>{userInfo.nickname}</h3>
          <p>이메일: {userInfo.email}</p>
          <p>자기소개: {userInfo.description}</p>
          <p>포인트: {userInfo.point}</p>
          <p>가입일: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
          <Link to="/edit-profile" className="edit-profile-button">
            프로필수정
          </Link>
        </div>
      </div>
      <div className="outuser-container">
        <p className="outuser">회원 탈퇴</p>
      </div>
    </div>
  );
}

export default Profile;
