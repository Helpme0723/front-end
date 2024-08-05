import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo } from '../apis/user';
import '../styles/components/Header.css';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError(error.message);
      if (error.response && error.response.status === 401) {
        // 토큰 만료 등으로 인해 401 오류가 발생한 경우 로그아웃 처리
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, fetchUserInfo]);

  return (
    <header className="header">
      <div className="header-title">TalentVerse</div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">
          홈
        </Link>
        <Link to="/subscribes/posts" className="nav-link">
          구독
        </Link>
        <Link to="/library" className="nav-link">
          보관함
        </Link>
        <Link to="/categories" className="nav-link">
          카테고리
        </Link>
      </nav>
      <div className="header-actions">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="검색" />
          <button className="search-button">🔍</button>
        </div>
        {isAuthenticated ? (
          <div className="dropdown">
            {user && user.profileUrl && (
              <img
                src={user.profileUrl}
                alt="Profile"
                className="profile-image"
              />
            )}
            <div className="dropdown-content">
              <Link to="/profile">마이페이지</Link>
              <Link to="/subscribes/posts">구독</Link>
              <Link to="/library">보관함</Link>
              <Link to="/points">포인트</Link>
              <Link to="/logout" onClick={logout}>
                로그아웃
              </Link>
            </div>
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            로그인
          </Link>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </header>
  );
}

export default Header;
