import React, { useEffect, useState } from 'react';
import { fetchAllPosts } from '../apis/main';
import { findAllSeries } from '../apis/series';
import '../styles/pages/MainContent.css';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../components/Testpagenation';
import Modal from 'react-modal';

function MainContent() {
  const [posts, setPosts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [view, setView] = useState('posts');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1); // 모달 페이지 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (view === 'posts') {
          const response = await fetchAllPosts(undefined, currentPage);
          console.log('API Response:', response);
          setPosts(response.data.posts);
          setTotalPages(response.data.meta.totalPages);
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
  }, [currentPage, view]);

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

  if (loading) return <div>데이터를 불러오는 중...</div>;

  return (
    <main className="main-content">
      <div className="mainheader">
        <button onClick={() => setModalIsOpen(true)}>"사용 가이드"</button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          {/* 모달 페이지에 따른 콘텐츠 표시 */}
          {modalPage === 1 && (
            <div>
              <h2>TalentVerse에 오신 여러분 환영합니다!</h2>
              <p>여기는 첫 번째 페이지입니다.</p>
              <button onClick={handleNextModalPage}>다음</button>
            </div>
          )}
          {modalPage === 2 && (
            <div>
              <h2>두 번째 페이지</h2>
              <p>여기는 두 번째 페이지입니다.</p>
              <button onClick={handlePrevModalPage}>이전</button>
              <button onClick={handleNextModalPage}>다음</button>
            </div>
          )}
          {modalPage === 3 && (
            <div>
              <h2>세 번째 페이지</h2>
              <p>여기는 세 번째 페이지입니다.</p>
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
            <div
              className={`post-type ${post.price > 0 ? 'post-paid' : 'post-free'}`}
            >
              {post.price > 0 ? '유료' : '무료'}
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
