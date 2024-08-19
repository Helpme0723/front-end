import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserDetails } from '../apis/user'; // 사용자 정보를 가져오는 API
import { getUserChannels } from '../apis/channel'; // 사용자의 채널 목록을 가져오는 API
import '../styles/pages/UserDetail.css'; // 사용자 상세 페이지 스타일링
import Pagination from '../components/Testpagenation'; // 페이지네이션 컴포넌트

function UserDetailPage() {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 사용자 정보 가져오기
        const userData = await fetchUserDetails(userId);
        setUserDetails(userData.data);

        // 사용자의 채널 목록 가져오기
        const channelData = await getUserChannels(userId, page, 10);
        setChannels(channelData.data.channels);
        setTotalPages(channelData.data.meta.totalPages);
      } catch (error) {
        console.error('Error fetching user details or channels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, page]);

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="user-channel-container">
      {userDetails ? (
        <>
          <img 
            src={userDetails.profileUrl} 
            alt={`${userDetails.nickname}의 프로필`} 
            className="user-profile-image" // 유저 프로필 이미지에 대한 클래스 추가
          />
          <h1>{userDetails.nickname}</h1>
          <p>이메일: {userDetails.email}</p>
          <p>가입일: {new Date(userDetails.createdAt).toLocaleDateString('ko-KR')}</p>
          <p>{userDetails.description || '소개글이 없습니다.'}</p>
        </>
      ) : (
        <p>사용자 정보를 불러오지 못했습니다.</p>
      )}

      <h2>채널 목록</h2>
      {channels.length > 0 ? (
        <div className="user-channel-grid">
          {channels.map((channel) => (
            <Link 
              to={`/search/channel/${channel.id}`} // 채널 상세 페이지로 이동하는 링크
              key={channel.id} 
              className="user-channel-card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img src={channel.imageUrl} alt={channel.title} className="user-channel-image" />
              <h3>{channel.title}</h3>
              <p>{channel.description}</p>
              <p>구독자 수: {channel.subscribers}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>채널이 없습니다.</p>
      )}

      {/* 페이지네이션 컴포넌트 사용 */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={() => setPage(page - 1)}
        onNextPage={() => setPage(page + 1)}
      />
    </div>
  );
}

export default UserDetailPage;
