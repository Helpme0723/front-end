import React, { useState, useEffect, useContext } from 'react';
import { fetchLikedPosts, fetchPurchasedPosts } from '../apis/libray';
import AuthContext from '../context/AuthContext';

function LibraryPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [likedPosts, setLikedPosts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('로그인이 필요합니다.');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const likedResponse = await fetchLikedPosts(1, 10, 'desc');
        const purchasedResponse = await fetchPurchasedPosts(1, 10, 'desc');
        console.log('Liked Posts:', likedResponse);
        console.log('Purchased Posts:', purchasedResponse);
        setLikedPosts(likedResponse.items);
        setPurchasedPosts(purchasedResponse.items);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생', error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, [isAuthenticated]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>보관함</h1>
      <div>
        <h2>좋아요한 포스트</h2>
        {likedPosts.map(post => (
          <div key={post.id}>{post.title || "제목 없음"}</div>  // Adjusted to handle empty titles
        ))}
      </div>
      <div>
        <h2>구매한 포스트</h2>
        {purchasedPosts.map(post => (
          <div key={post.id}>{post.title || "제목 없음"}</div>  // Adjusted to handle empty titles
        ))}
      </div>
    </div>
  );
}

export default LibraryPage;
