import React, { useEffect, useState, useCallback } from 'react';
import { getUserChannels } from '../apis/channel';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/GetChannels.css';

// 유저의 채널 목록 조회
const GetChannelsComponent = () => {
  const [channels, setChannels] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // query 값 가져옴
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      userId: params.get('userId') || false,
      page: params.get('page') || 1,
      limit: params.get('limit') || 10,
    };
  }, [location.search]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { userId, page, limit } = getQueryParams();
        const data = await getUserChannels(userId, page, limit);
        console.log(data);

        setChannels(data.data.channels);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchChannels();
  }, [location.search, getQueryParams]); // location.search와 getQueryParams를 의존성으로 추가

  const handleInsightClick = (channelId) =>{
    const { userId } = getQueryParams();
    navigate(`/channel/${channelId}/insights?userId=${userId}`);
  }

  return (
    <div className="container">
      {channels.length > 0 ? (
        channels.map(channel => (
          <div className="channel-card" key={channel.id}>
            <img
              className="channel-image"
              src={channel.imageUrl}
              alt={channel.title}
            />
            <div className="channel-content">
              <div className="channel-header">
                <div className="channel-title">
                  <Link to={`/channel/${channel.id}`}>{channel.title}</Link>
                </div>
                <div className="channel-subscribers">
                  구독자: {channel.subscribers}
                </div>
              </div>
              <div className="channel-description">{channel.description}</div>
            </div>
            <button 
              className="insight-button"
              onClick={() => handleInsightClick(channel.id)}
            >
              통계</button>
          </div>
        ))
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};

export default GetChannelsComponent;
