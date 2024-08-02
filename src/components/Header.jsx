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
        <Link to="/saved" className="nav-link">
          보관함
        </Link>
        <Link to="/categories" className="nav-link">
          카테고리
        </Link>
      </nav>
      <div className="header-actions">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Q" />
          <button className="search-button">+</button>
        </div>
        {isAuthenticated ? (
          <>
            {user && user.profileUrl && (
              <img
                src={user.profileUrl}
                alt="Profile"
                className="profile-image"
              />
            )}
            <Link to="/logout" className="nav-link" onClick={logout}>
              로그아웃
            </Link>
          </>
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
