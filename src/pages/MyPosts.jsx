import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMyPosts } from '../apis/post';
import '../styles/pages/MyPosts.css';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [sort, setSort] = useState('desc');

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
        console.log(data.data.posts[0].createdAt);

        console.log('@@@@', posts);
      } catch (error) {
        console.error('내 포스트를 불러오는데 실패하였습니다', error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [page, limit, sort]);

  const handlePageChange = newPage => {
    setPage(newPage);
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
          {posts.map(item => (
            <li
              key={item.id}
              className="list-item"
              onClick={() => navigate(`/post/${item.id}`)}
            >
              <div className="post-card">
                <div className="post-info">
                  <h2 className="post-title">{item.title || '제목 없음'}</h2>
                  <div className="post-description">
                    {item.preview
                      ? item.preview.substring(0, 50)
                      : '설명이 없습니다.'}
                  </div>
                  <div className="post-date">
                    생성일: {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          이전
        </button>
        <span>{page}</span>
        <button onClick={() => handlePageChange(page + 1)}>다음</button>
      </div>
    </div>
  );
};

export default MyPostsPage;
