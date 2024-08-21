import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMyPosts } from '../apis/post';
import '../styles/pages/MyPosts.css';
import Pagination from '../components/Testpagenation';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [sort, setSort] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getMyPosts(page, limit, sort);

        setPosts(data.data.posts);
        setTotalPages(data.data.meta.totalPages);
      } catch (error) {
        console.error('내 포스트를 불러오는데 실패하였습니다', error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [page, limit, sort]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const handleSortChange = event => {
    setSort(event.target.value);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="container">
      <h1 className="title">내 포스트 조회</h1>
      <div className="controls">
        <label htmlFor="sort">정렬:</label>
        <select id="sort" value={sort} onChange={handleSortChange}>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : (
        <ul className="list">
          {posts.map(post => (
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
          ))}
        </ul>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default MyPostsPage;
