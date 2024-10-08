import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLikedPosts } from '../apis/library';
import AuthContext from '../context/AuthContext';
import '../styles/pages/mainlibrary.css';
import { Link } from 'react-router-dom';
import Pagination from '../components/Testpagenation';

function LibraryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 메인 페이지로 리다이렉트
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 좋아요한 포스트를 가져오는 API 호출 (limit을 5로 설정)
        const response = await fetchLikedPosts(currentPage, 5, 'desc');
        // response.data.items에 접근하여 아이템 배열 가져오기
        const likedItems = response.data.items || [];
        setLikedPosts(likedItems);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, navigate, currentPage]);

  if (loading) return <div>로딩 중...</div>;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="library-container">
      <h1>보관함</h1>
      <div className="header-container">
        <h2>좋아요</h2>
        <h2 className="library-purchase-link">
          <Link to="/library/purchases">구매</Link>
        </h2>
      </div>
      <div className="liked-posts">
        {likedPosts.length > 0 ? (
          likedPosts.map(post => (
            <Link
              to={`/post/${post.postId}`}
              key={post.id}
              className="post-entry-link"
            >
              <div className="post-entry">
                <div className="post-info">
                  <h3>{post.post.title || '제목 없음'}</h3>
                  <p>{post.post.preview.substring(0, 20)}...</p>
                  <p>좋아요: {post.post.likeCount || 0}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>좋아요한 포스트가 없습니다.</p>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}

export default LibraryPage;
