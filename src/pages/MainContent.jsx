import React, { useEffect, useState } from 'react';
import { fetchAllPosts } from '../apis/main';
import '../styles/pages/MainContent.css';
import { Link } from 'react-router-dom';
import Pagination from '../components/Testpagenation';

function MainContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchAllPosts(undefined, currentPage);
        console.log("API Response:", response); // API 응답 로깅
        setPosts(response.data.posts);
        setTotalPages(response.data.meta.totalPages); // 응답에서 제공된 총 페이지 수 사용
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };
  

  if (loading) return <div>포스트 읽어오는중.....</div>;

  return (
    <main className="main-content">
      <h2>포스트</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-card">
            <div className="post-info">
              <div className="post-title">{post.title || '제목 없음'}</div>
              <div className="post-description">{post.preview.substring(0, 20)}</div>
              <div className="post-author">
              <img src={post.userImage} alt={`Profile of ${post.nickname}`} className="profile-image" />
                작성자: {post.userName}</div>
              <div className="post-date">생성일: {formatDate(post.createdAt)}</div>
              <div className="post-price">가격:{post.price} 포인트</div>
            </div>
          </Link>
        ))
      ) : (
        <p>포스트가 없습니다.</p>
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
