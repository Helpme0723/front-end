import React, { useEffect, useState } from 'react';
import { getSubscribes } from '../apis/auth';
import '../styles/pages/GetSubscribe.css';
import Pagination from '../components/Testpagenation';
import { Link } from 'react-router-dom';

// 구독한 채널 목록 조회
function GetSubscribeChannels() {
  const [channels, setChannels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 관리
  const itemsPerPage = 9; // 페이지당 항목 수 설정

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getSubscribes();
        const sortedChannels = data.data.subscribes.sort(
          (a, b) => b.subscribers - a.subscribers,
        ); // 구독자 수 많은 순으로 정렬
        setChannels(sortedChannels);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchChannels();
  }, []);

  const totalPages = Math.ceil(channels.length / itemsPerPage); // 전체 페이지 수 계산

  const indexOfLastChannel = currentPage * itemsPerPage;
  const indexOfFirstChannel = indexOfLastChannel - itemsPerPage;
  const currentChannels = channels.slice(
    indexOfFirstChannel,
    indexOfLastChannel,
  );

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); // 이전 페이지로 이동
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages)); // 다음 페이지로 이동
  };

  return (
    <div className="sub-channel-container">
      <h1>구독한 채널</h1>
      {currentChannels.length > 0 ? (
        <ul className="sub-channel-list">
          {currentChannels.map((channel, index) => (
            <li className="sub-channel-item" key={index}>
              <Link
                to={`/search/channel/${channel.channelId}`}
                className="sub-channel-link"
              >
                <h2 className="sub-channel-title">{channel.title}</h2>
                <img
                  className="sub-channel-image"
                  src={channel.imageUrl}
                  alt={channel.title}
                />
                <p className="sub-channel-description">{channel.description}</p>
                <p className="sub-channel-subscribers">
                  구독자: {channel.subscribers}명
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sub-channel-no-posts">채널이 없습니다.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
}

export default GetSubscribeChannels;
