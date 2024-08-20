import React, { useContext, useEffect, useState } from 'react';
import { fetchAllPosts, fetchAllPostsLogIn } from '../apis/main';
import { findAllSeries } from '../apis/series';
import '../styles/pages/MainContent.css';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../components/Testpagenation';
import Modal from 'react-modal';
import AuthContext from '../context/AuthContext';

function MainContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState('posts');
  const [sortType, setSortType] = useState('createdAt');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1); // 모달 페이지 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (view === 'posts') {
          if (!isAuthenticated) {
            const response = await fetchAllPosts(
              undefined,
              currentPage,
              9,
              'desc',
              sortType,
            );
            console.log('API Response:', response);
            setPosts(response.data.posts);
            setTotalPages(response.data.meta.totalPages);
          } else if (isAuthenticated) {
            const response = await fetchAllPostsLogIn(
              undefined,
              currentPage,
              9,
              'desc',
              sortType,
            );
            console.log('@@@@@@@@@@@@API Response:', response.items);
            setPosts(response.items);
            setTotalPages(response.meta.totalPages);
          }
        } else if (view === 'series') {
          const response = await findAllSeries(
            undefined,
            currentPage,
            9,
            'asc',
          );
          console.log('Series API Response:', response);
          setSeries(response.data.series || []);
          setTotalPages(response.data.meta.totalPages);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, view, sortType]);

  useEffect(() => {
    setModalIsOpen(true); // 페이지 로드 시 모달 자동 열림
  }, []);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const handleNextModalPage = () => {
    setModalPage(prevPage => prevPage + 1);
  };

  const handlePrevModalPage = () => {
    setModalPage(prevPage => Math.max(1, prevPage - 1));
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const lastClosedDate = localStorage.getItem('lastClosedDate');
    const todayDate = getTodayDate();
    if (lastClosedDate !== todayDate) {
      setModalIsOpen(true); // 페이지 로드 시 모달 자동 열림
    } else {
      setModalIsOpen(false); // '오늘 하루 보지 않기'를 눌렀다면 모달 열리지 않음
    }
  }, []);

  const handleDontShowToday = () => {
    localStorage.setItem('lastClosedDate', getTodayDate());
    setModalIsOpen(false);
  };

  if (loading) return <div>데이터를 불러오는 중...</div>;

  return (
    <main className="main-content">
      <div className="mainheader">
        <button onClick={() => setModalIsOpen(true)}> 📚 </button>
        <select onChange={e => setSortType(e.target.value)} value={sortType}>
          <option value="createdAt">최신순</option>
          <option value="likeCount">좋아요순</option>
          <option value="viewCount">조회수순</option>
          <option value="price">가격순</option>
        </select>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
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
              <p>
                4. 생성한 채널에서 포스트 생성버튼을 누르면 포스트 생성완료!
              </p>
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
        <span>{view === 'posts' ? '포스트' : '시리즈'}</span>
        <div className="button-group">
          <button onClick={() => setView('posts')}>포스트 보기</button>
          <button onClick={() => setView('series')}>시리즈 보기</button>
        </div>
      </div>
      {view === 'posts' && posts.length > 0 ? (
        posts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-card">
            <div className="icon-container">
              <div
                className={`post-type ${post.price > 0 ? 'post-paid' : 'post-free'}`}
              >
                {post.price > 0 ? '유료' : '무료'}
              </div>
              {post.isPurchased && (
                <div className="post-purchased">구매한 포스트</div>
              )}
            </div>
            <div className="post-info">
              <div className="post-title">{post.title || '제목 없음'}</div>
              <div className="post-description">
                {post.preview.substring(0, 20)}
              </div>
              <div className="post-author">
                <img
                  src={post.userImage}
                  alt={`Profile of ${post.nickname}`}
                  className="profile-image"
                />
                작성자: {post.userName}
              </div>
              <div className="thumbNail">
                <img
                  src={post.thumbNail}
                  alt={`ThumbNail of ${post.thumbNail}`}
                  className="thumbNail-image"
                />
              </div>
              <div className="post-date">
                생성일: {formatDate(post.createdAt)}
              </div>
              {post.price > 0 && (
                <div className="post-price">가격: {post.price} 포인트</div>
              )}
            </div>
          </Link>
        ))
      ) : view === 'series' && series.length > 0 ? (
        series.map(series => (
          <div
            key={series.id}
            className="series-card"
            onClick={() => navigate(`/series/${series.id}`)}
          >
            <div className="series-info">
              <div className="series-title">{series.title}</div>
              <div className="series-description">{series.description}</div>
            </div>
          </div>
        ))
      ) : (
        <p>{view === 'posts' ? '포스트가 없습니다.' : '시리즈가 없습니다.'}</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </main>
  );
}

export default MainContent;
