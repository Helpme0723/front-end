import React, { useEffect, useState } from 'react';
import { fetchAllPosts } from '../apis/main';
import '../styles/pages/MainContent.css';

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

  if (loading) return <div>Loading posts...</div>;

  return (
    <main className="main-content">
      <h2>포스트</h2>
      {posts.length > 0 ? (
        posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-info">
              <div className="post-title">{post.title}</div>
              <div className="post-description">{post.preview}</div>
              <div className="post-author">작성자: {post.author}</div>
            </div>
            <div className="post-date">{post.date}</div>
          </div>
        ))
      ) : (
        <p>포스트가 없습니다.</p>
      )}
       <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
        <span>페이지 {currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
      </div>
    </main>
  );
}

export default MainContent;
