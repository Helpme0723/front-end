import React, { useState, useEffect, useContext } from 'react';
import { fetchLikedPosts} from '../apis/libray';
import AuthContext from '../context/AuthContext';
import '../styles/pages/mainlibrary.css'
import { Link } from 'react-router-dom';

function LibraryPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('로그인이 필요합니다.');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 좋아요한 포스트를 가져오는 API 호출
        const response = await fetchLikedPosts(1, 10, 'desc');
        console.log('Response Data:', response); // 디버깅을 위한 로그
        // response.data.items에 접근하여 아이템 배열 가져오기
        const likedItems = response.data.items || [];
        setLikedPosts(likedItems);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="library-container">
      <h1>보관함</h1>
      <div className="header-container"> {/* 헤더 컨테이너 추가 */}
        <h2>좋아요</h2>
        <h2><Link to="/library/purchases" className="purchase-link">구매</Link></h2>
      </div>
      <div className="liked-posts">
        {likedPosts.length > 0 ? (
          likedPosts.map(post => (
            <div key={post.id} className="post-entry">
              <div className="post-info">
                <h3>{post.post.title || '제목 없음'}</h3>
                <p>{post.post.preview.substring(0, 20)}...</p>
                <p>좋아요: {post.post.likeCount || 0}</p>
              </div>
              <img src="/front-end/src/assets/sample.jpg" alt="Sample" className="post-image" />
            </div>
          ))
        ) : (
          <p>좋아요한 포스트가 없습니다.</p>
        )}
      </div>
      <div className="purchased-posts">
        {/* 구매한 포스트 내용을 여기에 추가 */}
      </div>
    </div>
  );
}

export default LibraryPage;