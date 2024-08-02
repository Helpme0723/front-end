import React, { useEffect, useState } from 'react';
import api from '../apis/axiosInstance';

function MainContent() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/post'); // 실제 백엔드 API 엔드포인트로 변경
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="main-content">
      <h2>포스트 목록</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
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
    </main>
  );
}

export default MainContent;
