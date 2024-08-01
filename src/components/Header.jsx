import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Components.css';

function Header() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-title">TalentVerse</div>
      <nav className="nav-links">
        <Link to="/" className="nav-link">홈</Link>
        {/* <Link to="/subscribe" className="nav-link">구독</Link>
        <Link to="/saved" className="nav-link">보관함</Link>
        <Link to="/categories" className="nav-link">카테고리</Link> */}
        <Link to="/profile" className="nav-link">마이페이지</Link>
        {/* <Link to="/subscriptions" className="nav-link">구독</Link>
        <Link to="/points" className="nav-link">포인트</Link> */}
        {!isAuthenticated && <Link to="/login" className="nav-link">로그인</Link>}
        {isAuthenticated && <Link to="/logout" className="nav-link">로그아웃</Link>}
      </nav>
    </header>
  );
}

export default Header;
