import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findChannel } from '../apis/channel';
import '../styles/pages/ChannelDetailsPage.css';

function ChannelDetailsPage() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 현재 활성화된 탭 상태

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const data = await findChannel(channelId);
        setChannel(data.data);
      } catch (error) {
        console.error('Failed to fetch channel details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelDetails();
  }, [channelId]);

  if (loading) {
    return <div>로딩중...</div>;
  }

  if (!channel) {
    return <div>채널을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="channel-details-container">
      <h1>{channel.title}</h1>
      <img
        src={channel.imageUrl || 'path/to/default-image.jpg'}
        alt="채널 이미지"
        className="channel-image"
      />
      <p>{channel.description || '채널 설명이 없습니다.'}</p>
      <p>구독자 수: {channel.subscribers}</p>

      <div className="channel-nav">
        <button
          onClick={() => setActiveTab('posts')}
          className={activeTab === 'posts' ? 'active' : ''}
        >
          포스트
        </button>
        <button
          onClick={() => setActiveTab('series')}
          className={activeTab === 'series' ? 'active' : ''}
        >
          시리즈
        </button>
      </div>

      {activeTab === 'posts' && (
        <section className="channel-section">
          <h2>포스트</h2>
          <div className="posts-list">
            {channel.posts.length > 0 ? (
                channel.posts.map(post => (
                  <Link to={`/post/${post.id}`} key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <p>카테고리: {post.category}</p>
                    <p>가격: {post.price > 0 ? `${post.price}원` : '무료'}</p>
                    <p>조회수: {post.viewCount}</p>
                    <p>좋아요 수: {post.likeCount}</p>
                    <p>작성일: {new Date(post.createdAt).toLocaleDateString()}</p>
                  </Link>
                ))
            ) : (
              <p>포스트가 없습니다.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'series' && (
        <section className="channel-section">
          <h2>시리즈</h2>
          <div className="series-list">
            {channel.series.length > 0 ? (
              channel.series.map(series => (
                <div key={series.id} className="series-card">
                  <h3>{series.title}</h3>
                  <p>{series.description}</p>
                  <p>작성일: {new Date(series.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>시리즈가 없습니다.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default ChannelDetailsPage;
