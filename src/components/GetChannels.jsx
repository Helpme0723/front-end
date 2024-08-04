import React, { useEffect, useState } from 'react';
import { getUserChannels } from '../apis/channel';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/GetChannels.css';

// 유저의 채널 목록 조회
const GetChannelsComponent = () => {
  const [channels, setChannels] = useState([]);
  const location = useLocation();

  // query 값 가져옴
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      userId: params.get('userId') || false,
      page: params.get('page') || 1,
      limit: params.get('limit') || 10,
    };
  };

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
  }, [location.search]); // location.search를 의존성으로 추가

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
            <button className="subscribe-button">+ 구독</button>
          </div>
        ))
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};
export default GetChannelsComponent;
