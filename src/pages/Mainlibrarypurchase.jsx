import React, { useState, useEffect, useContext } from 'react';
import { fetchPurchasedPosts } from '../apis/library';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/pages/mainlibrary.css';
import Pagination from '../components/Testpagenation';

function PurchasedPostsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 메인 페이지로 리다이렉트
      return;
    }

    const fetchData = async page => {
      setLoading(true);
      try {
        const response = await fetchPurchasedPosts(page, 5, 'desc'); // 페이지당 5개의 포스트를 불러오도록 설정
        console.log('Response Data:', response);
        const purchasedItems = response.data.items || [];
        setPurchasedPosts(purchasedItems);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(currentPage);
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
        <h2 className="library-likes-link">
          <Link to="/library">좋아요</Link>
        </h2>
        <h2>구매</h2>
      </div>
      <div className="purchased-posts">
        {purchasedPosts.length > 0 ? (
          purchasedPosts.map(post => (
            <Link
              to={`/post/${post.post.id}`}
              key={post.id}
              className="post-entry-link"
            >
              <div className="post-entry">
                <div className="post-info">
                  <h3>{post.post.title || '제목 없음'}</h3>
                  <p>{post.post.preview.substring(0, 20)}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>구매한 포스트가 없습니다.</p>
        )}
      </div>
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}

export default PurchasedPostsPage;
