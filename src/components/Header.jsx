import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getUserInfo } from '../apis/user';
import { connectToNotifications } from '../apis/sse'; // SSE 연결 함수
import '../styles/components/Header.css';
import { SearchContext } from '../context/SearchContext';
import { searchRanking } from '../apis/search';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [searchRankings, setSearchRankings] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null); // 알림 메시지 상태
  const { performSearch, setSearchTerm } = useContext(SearchContext);
  const [searchInput, setSearchInput] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const fetchSearchRankings = useCallback(async () => {
    try {
      const rankings = await searchRanking(); // searchRanking 함수 호출
      setSearchRankings(rankings);
    } catch (error) {
      console.error('Error fetching search rankings:', error);
      setError('검색 랭킹을 불러오는데 실패했습니다.');
    }
  }, []);

  useEffect(() => {
    fetchSearchRankings();
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      logout();
    } else if (isAuthenticated) {
      fetchUserInfo();
    }

    if (isAuthenticated) {
      console.log('SSE 연결 시도 중...');

      const disconnectSSE = connectToNotifications(
        notification => {
          console.log('알림 수신:', notification);
          setNotificationMessage(notification.message);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 3000);
        },
        () => {
          console.error('SSE 연결 오류 발생');
        },
      );

      return () => {
        disconnectSSE();
        console.log('SSE 연결 해제');
      };
    }
  }, [isAuthenticated, fetchUserInfo, logout, fetchSearchRankings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === searchRankings.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000); // 3초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [searchRankings]);

  const handleSearch = async e => {
    e.preventDefault();
    if (!searchInput.trim()) {
      navigate('/');
      return;
    }
    try {
      await performSearch(searchInput, searchField, 1, 10, 'desc');
      setSearchTerm(searchInput);
      navigate('/search-results');
    } catch (error) {
      console.error('Failed to perform search:', error);
    }
  };

  return (
    <header className="header">
      {notificationMessage && (
        <div className={`notification-banner show`}>{notificationMessage}</div>
      )}
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
        <div className="search-rankings">
          <h3>실시간 검색 랭킹</h3>
          <ul>
            {searchRankings.length > 0 && (
              <li key={currentIndex} className="ranking-item">
                {searchRankings[currentIndex]}
              </li>
            )}
          </ul>
        </div>
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="검색"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <select
            value={searchField}
            onChange={e => setSearchField(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="all">제목 + 내용</option>
          </select>
          <button type="submit" className="search-button">
            🔍
          </button>
        </form>
        <Link to="/notifications" className="notification-icon">
          🔔
        </Link>
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
