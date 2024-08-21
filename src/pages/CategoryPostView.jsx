import React, { useEffect, useState, useCallback } from 'react';
import { categoryPostView } from '../apis/post';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Pagination from '../components/Testpagenation';
import '../styles/pages/CategoryPostView.css';

const categories = [
  { id: 1, name: '웹툰' },
  { id: 2, name: '영화' },
  { id: 3, name: '소설' },
  { id: 4, name: '정치' },
  { id: 5, name: '경제' },
  { id: 6, name: '지식' },
  { id: 7, name: '일상' },
];

function CategoryPostView() {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      categoryId: params.get('categoryId') || categories[0].id,
      page: params.get('page') || 1,
      limit: params.get('limit') || 9,
    };
  }, [location.search]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { categoryId, page, limit } = getQueryParams();
        const response = await categoryPostView(categoryId, page, limit);
        console.log(response.data.posts);

        setPosts(response.data.posts);
        setTotalPages(response.data.meta.totalPages);
        setCurrentPage(parseInt(page, 10));
        setSelectedCategory(parseInt(categoryId, 10));
      } catch (error) {
        console.error('Error: fetching posts', error);
      }
    };
    fetchPosts();
  }, [getQueryParams]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      navigate(
        `?categoryId=${selectedCategory}&page=${currentPage - 1}&limit=9`,
      );
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      navigate(
        `?categoryId=${selectedCategory}&page=${currentPage + 1}&limit=9`,
      );
    }
  };

  const handleCategoryChange = categoryId => {
    navigate(`?categoryId=${categoryId}&page=1&limit=9`);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  if (posts.length === 0) return <div>데이터를 불러오는 중...</div>;

  return (
    <main className="category-post-content">
      <div className="category-post-header">
        <div className="category-post-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-post-button ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="category-posts-grid">
        {posts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-card">
            <div className="icon-container">
              {post.isPurchased && (
                <div className="post-purchased">구매한 포스트</div>
              )}
              <div
                className={`post-type ${post.price > 0 ? 'post-paid' : 'post-free'}`}
              >
                {post.price > 0 ? '유료' : '무료'}
              </div>
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
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </main>
  );
}

export default CategoryPostView;
