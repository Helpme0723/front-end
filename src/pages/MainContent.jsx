import React, { useContext, useEffect, useState } from 'react';
import { fetchAllPosts, fetchAllPostsLogIn } from '../apis/main';
import { findAllSeries } from '../apis/series';
import '../styles/pages/MainContent.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Pagination from '../components/Testpagenation';
import AuthContext from '../context/AuthContext';

function MainContent() {
  const { isAuthenticated } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postPage, setPostPage] = useState(1); // 포스트 페이지 상태
  const [seriesPage, setSeriesPage] = useState(1); // 시리즈 페이지 상태
  const [postTotalPages, setPostTotalPages] = useState(0); // 포스트의 총 페이지 수
  const [seriesTotalPages, setSeriesTotalPages] = useState(0); // 시리즈의 총 페이지 수
  const [view, setView] = useState('posts');
  const [sortType, setSortType] = useState('createdAt');
  const [isFirstLoad, setIsFirstLoad] = useState(true); // 첫 로드 상태 추가
  const navigate = useNavigate();
  const location = useLocation();

  //페이지 이동시 위치 저장
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentView = queryParams.get('view') || 'posts';
    const page = parseInt(queryParams.get('page'), 10) || 1;
    const sort = queryParams.get('sort') || 'createdAt'; // sort 파라미터 읽기

    setView(currentView);
    setSortType(sort); // sortType 상태 설정

    if (currentView === 'posts') {
      setPostPage(page);
    } else if (currentView === 'series') {
      setSeriesPage(page);
    }

    setIsFirstLoad(false); // 첫 로드가 끝났음을 표시
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (view === 'posts') {
          if (!isAuthenticated) {
            const response = await fetchAllPosts(
              undefined,
              postPage,
              9,
              'desc',
              sortType,
            );
            setPosts(response.data.posts);
            setPostTotalPages(response.data.meta.totalPages);
          } else {
            const response = await fetchAllPostsLogIn(
              undefined,
              postPage,
              9,
              'desc',
              sortType,
            );
            setPosts(response.items);
            setPostTotalPages(response.meta.totalPages);
          }
        } else if (view === 'series') {
          const response = await findAllSeries(undefined, seriesPage, 9, 'asc');
          setSeries(response.data.series || []);
          setSeriesTotalPages(response.data.meta.totalPages);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isFirstLoad) {
      fetchData(); // 첫 로드 이후에만 fetchData 호출
    }
  }, [postPage, seriesPage, view, sortType, isAuthenticated, isFirstLoad]);

  const handlePrevPage = () => {
    if (view === 'posts') {
      const prevPage = Math.max(1, postPage - 1);
      navigate(`?view=${view}&page=${prevPage}&sort=${sortType}`);
      setPostPage(prevPage);
    } else {
      const prevPage = Math.max(1, seriesPage - 1);
      navigate(`?view=${view}&page=${prevPage}&sort=${sortType}`);
      setSeriesPage(prevPage);
    }
  };

  const handleNextPage = () => {
    if (view === 'posts') {
      const nextPage = postPage < postTotalPages ? postPage + 1 : postPage;
      navigate(`?view=${view}&page=${nextPage}&sort=${sortType}`);
      setPostPage(nextPage);
    } else {
      const nextPage =
        seriesPage < seriesTotalPages ? seriesPage + 1 : seriesPage;
      navigate(`?view=${view}&page=${nextPage}&sort=${sortType}`);
      setSeriesPage(nextPage);
    }
  };

  const handleSortChange = newSortType => {
    setSortType(newSortType);
    navigate(`?view=${view}&page=1&sort=${newSortType}`); // sortType을 URL에 반영
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  if (loading) return <div>데이터를 불러오는 중...</div>;

  return (
    <main className="main-content">
      <div className="mainheader">
        <select
          onChange={e => handleSortChange(e.target.value)}
          value={sortType}
        >
          <option value="createdAt">최신순</option>
          <option value="likeCount">좋아요순</option>
          <option value="viewCount">조회수순</option>
          <option value="price">가격순</option>
        </select>
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
              <div className="post-viewcount">조회수: {post.viewCount}</div>
              <div className="thumbNail">
                <img
                  src={post.thumbNail}
                  alt={`ThumbNail of ${post.thumbNail}`}
                  className="thumbNail-image"
                />
              </div>
              <div className="post-date-price">
                {post.price > 0 && (
                  <div className="post-price">
                    가격: {post.price.toLocaleString('ko-KR')} 포인트
                  </div>
                )}
                <div className="post-date">
                  생성일: {formatDate(post.createdAt)}
                </div>
              </div>
              <div className="post-author">
                <img
                  src={post.userImage}
                  alt={`Profile of ${post.nickname}`}
                  className="profile-image"
                />
                작성자: {post.userName}
              </div>
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
        currentPage={view === 'posts' ? postPage : seriesPage}
        totalPages={view === 'posts' ? postTotalPages : seriesTotalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </main>
  );
}

export default MainContent;
