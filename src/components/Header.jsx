import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo } from '../apis/user';
import '../styles/components/Header.css';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  return (
    <header className="header">
      <div className="header-title">TalentVerse</div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">
          홈
        </Link>
        <Link to="/subscribe/posts" className="nav-link">
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
              <Link to="/subscribe/posts">구독</Link>
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
    </header>
  );
}

export default Header;
