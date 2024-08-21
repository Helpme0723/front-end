import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 확인

  // 오늘 날짜 확인 함수
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // "오늘 하루 보지 않기" 설정 확인 함수
  const isModalAlreadyClosedToday = () => {
    const lastClosedDate = localStorage.getItem('lastClosedDate');
    return lastClosedDate === getTodayDate();
  };

  // 모달이 처음 렌더링될 때 열리도록 설정
  useEffect(() => {
    if (!isModalAlreadyClosedToday()) {
      setModalIsOpen(true);
    }
  }, []);

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

    // 특정 경로에서만 SSE 연결 설정
    const ssePaths = [
      '/notifications', // 알림 페이지
      '/', // 메인 페이지
      `/post/${location.pathname.split('/')[2]}`, // 상세 페이지
      '/search-results', // 검색 페이지
    ];

    if (isAuthenticated && ssePaths.includes(location.pathname)) {
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
  }, [
    isAuthenticated,
    fetchUserInfo,
    logout,
    fetchSearchRankings,
    location.pathname,
  ]);

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

  const handleNextModalPage = () => {
    setModalPage(prevPage => prevPage + 1);
  };

  const handlePrevModalPage = () => {
    setModalPage(prevPage => Math.max(1, prevPage - 1));
  };

  const handleDontShowToday = () => {
    // 오늘 날짜를 localStorage에 저장
    localStorage.setItem('lastClosedDate', getTodayDate());
    setModalIsOpen(false);
  };

  return (
    <header className="header">
      {notificationMessage && (
        <div className={`notification-banner show`}>{notificationMessage}</div>
      )}
      <Link to="/" className="header-title">
        TalentVerse
      </Link>
      <nav className="nav-links">
        <Link to="/subscribes/posts" className="nav-link">
          구독
        </Link>
        <Link to="/library" className="nav-link">
          보관함
        </Link>
        <Link to="/posts" className="nav-link">
          카테고리
        </Link>
        <div className="nav-link" onClick={() => setModalIsOpen(true)}>
          이용 가이드
        </div>
      </nav>
      <div className="header-actions">
        {searchRankings.length > 0 && (
          <div className="search-rankings">
            <h3>인기 검색어</h3>
            <ul>
              <li key={currentIndex} className="ranking-item">
                {searchRankings[currentIndex]}
              </li>
            </ul>
          </div>
        )}
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
            <option value="nickname">닉네임</option>
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

      {/* 모달 관련 JSX */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {/* 모달 페이지에 따른 콘텐츠 표시 */}
        {modalPage === 1 && (
          <div
            style={{
              position: 'relative',
              paddingBottom: '50px',
              textAlign: 'center',
            }}
          >
            <img
              src="/favicon.ico"
              alt="TalentVerse Favicon"
              style={{
                width: '50px',
                height: '50px',
                display: 'block',
                margin: '0 auto',
              }} // 중앙 정렬
            />
            <h2>TalentVerse에 오신 여러분 환영합니다!</h2>
            <p>저희 서비스의 간단한 사용법을 알려드릴게요!</p>
            <button
              onClick={handleNextModalPage}
              style={{
                position: 'absolute',
                left: '70%',
                transform: 'translateX(-50%)',
                bottom: '10px', // 모달 하단에서의 거리
              }}
            >
              다음
            </button>
            <button
              onClick={handleDontShowToday}
              style={{
                position: 'absolute',
                left: '40%',
                transform: 'translateX(-30%)',
                bottom: '10px', // 모달 하단에서의 거리
              }}
            >
              오늘 하루 보지 않기
            </button>
          </div>
        )}
        {modalPage === 2 && (
          <div style={{ textAlign: 'center', paddingBottom: '50px' }}>
            <video
              src="/tutorialforPost.mp4" // public 폴더 내의 동영상 경로
              controls
              style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }} // 크기 및 중앙 정렬
            >
              브라우저가 비디오 태그를 지원하지 않습니다.
            </video>
            <h2>포스트 를 작성하는법</h2>
            <h3>포스트를 작성하기 위해선 채널이필요해요!</h3>
            <p>1. 로그인후 마이페이지로 이동</p>
            <p>2. 마이페이지 에서 채널 로 이동</p>
            <p>3. 채널생성 버튼 클릭후 채널을 생성</p>
            <p>4. 생성한 채널에서 포스트 생성버튼을 누르면 포스트 생성완료!</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handlePrevModalPage}>이전</button>
              <button
                onClick={handleNextModalPage}
                style={{ marginLeft: '10px' }}
              >
                다음
              </button>
            </div>
          </div>
        )}
        {modalPage === 3 && (
          <div style={{ textAlign: 'center', paddingBottom: '50px' }}>
            <video
              src="/tutorialforSubscribe.mp4" // public 폴더 내의 동영상 경로
              controls
              style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }} // 크기 및 중앙 정렬
            >
              브라우저가 비디오 태그를 지원하지 않습니다.
            </video>
            <h2>채널 구독하는법!</h2>
            <p>1. 마음에 드는 포스트를 클릭!</p>
            <p>2. 포스트에 있는 채널 버튼을 누르면 팝업창이 열려요!</p>
            <p>3. 구독하기 버튼을 누르면 구독이된답니다!</p>
            <p>4. 상단에 잇는 구독 탭을 누르면 확인이 가능해요!</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={handlePrevModalPage}>이전</button>
              <button
                onClick={handleNextModalPage}
                style={{ marginLeft: '10px' }}
              >
                다음
              </button>
            </div>
          </div>
        )}
        {modalPage === 4 && (
          <div
            style={{
              position: 'relative',
              paddingBottom: '50px',
              textAlign: 'center',
            }}
          >
            <img
              src="/favicon.ico"
              alt="TalentVerse Favicon"
              style={{
                width: '50px',
                height: '50px',
                display: 'block',
                margin: '0 auto',
              }} // 중앙 정렬
            />
            <h2>TalentVerse를 이용하시면서 좋은시간 보내세요!</h2>
            <button onClick={handlePrevModalPage}>이전</button>
            <button onClick={() => setModalIsOpen(false)}>닫기</button>
          </div>
        )}
      </Modal>
    </header>
  );
}

export default Header;
