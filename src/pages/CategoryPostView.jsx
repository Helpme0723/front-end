import React, { useEffect, useState } from 'react';
import { categoryPostView } from '../apis/post';
import { useLocation } from 'react-router-dom';
import '../styles/pages/CategoryPostView.css';

function CategoryPostView() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      categoryId: params.get('categoryId') || false,
      page: params.get('page') || 1,
      limit: params.get('limit') || 10,
    };
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { categoryId, page, limit } = getQueryParams();
        const response = await categoryPostView(categoryId, page, limit);
        console.log(response.data.posts);

        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error: fetching posts', error);
      }
    };
    fetchPosts();
  }, [location.search]);

  return (
    <div className="container">
      <h2>카테고리별 포스트</h2>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div className="post" key={index}>
            <div className="post-title">{post.title}</div>
            <div className="post-preview">{post.preview}</div>
            <div className="post-date">{post.createdAt}</div>
          </div>
        ))
      ) : (
        <p>포스트가 없습니다.</p>
      )}
    </div>
  );
}

export default CategoryPostView;
