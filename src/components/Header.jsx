import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo } from '../apis/user';
import '../styles/components/Header.css';
import { SearchContext } from '../context/SearchContext';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { performSearch, setSearchTerm } = useContext(SearchContext);
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [searchField, setSearchField] = useState('title'); // State for search field
  const navigate = useNavigate();

  const fetchUserInfo = useCallback(async () => {
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError(error.message);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [logout]);


  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      logout();
    } else if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated, fetchUserInfo, logout]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      // If search input is empty, navigate to the main page
      navigate('/');
      return;
    }
    try {
      // Perform the search using the search context
      await performSearch(searchInput, searchField, 1, 10, 'desc');
      setSearchTerm(searchInput);
      navigate('/search-results'); // Navigate to search results page
    } catch (error) {
      console.error('Failed to perform search:', error);
    }
  };

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
        <Link to="/posts" className="nav-link">
          카테고리
        </Link>
      </nav>
      <div className="header-actions">
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
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
              <Link to="/subscribes/channels">구독</Link>
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
