import React, { useState, useEffect, useContext } from 'react';
import { fetchPurchasedPosts } from '../apis/libray';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/pages/mainlibrary.css';

function PurchasedPostsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 메인 페이지로 리다이렉트
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchPurchasedPosts(1, 10, 'desc');
        console.log('Response Data:', response);
        const purchasedItems = response.data.items || [];
        setPurchasedPosts(purchasedItems);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="library-container">
      <h1>보관함</h1>
      <div className="header-container">
        <h2><Link to="/library" className="likes-link">좋아요</Link></h2>
        <h2>구매</h2>
      </div>
      <div className="purchased-posts">
        {purchasedPosts.length > 0 ? (
          purchasedPosts.map(post => (
            <div key={post.id} className="post-entry">
              <div className="post-info">
                <h3>{post.post.title || '제목 없음'}</h3>
                <p>{post.post.preview.substring(0, 20)}</p>
              </div>
              <img src="/path/to/sample-image.jpg" alt="Sample" className="post-image" />
            </div>
          ))
        ) : (
          <p>구매한 포스트가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default PurchasedPostsPage;