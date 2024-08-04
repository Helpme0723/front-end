import React, { useEffect, useState } from 'react';
import { getSubscribes } from '../apis/auth';
import '../styles/pages/GetSubscribe.css';
import PaginationComponent from '../components/Pagination';

// 구독한 채널 목록 조회
function GetSubscribeChannels() {
  const [channels, setChannels] = useState([]);
  const [activePage, setActivePage] = useState(1); // 현재 활성화된 페이지 상태 관리
  const itemsCountPerPage = 10; // 페이지당 항목 수 설정
  const totalItemsCount = 100; // 총 항목 수 설정.
  const pageRangeDisplayed = 5; // 표시할 페이지 범위 설정

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = pageNumber => {
    console.log(`active page is ${pageNumber}`);
    setActivePage(pageNumber); // 활성화된 페이지 상태 업데이트
  };

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getSubscribes();

        setChannels(data.data.subscribes);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchChannels();
  }, []);

  const indexOfLastChannel = activePage * itemsCountPerPage;
  const indexOfFirstChannel = indexOfLastChannel - itemsCountPerPage;
  const currentChannels = channels.slice(
    indexOfFirstChannel,
    indexOfLastChannel,
  );

  return (
    <>
      <div className="container">
        <h1>구독한 채널</h1>
        {currentChannels.length > 0 ? (
          <ul>
            {currentChannels.map((channel, index) => (
              <li key={index}>
                <h2>{channel.title}</h2>
                <img src={channel.imageUrl} alt={channel.title} />
                <p>{channel.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-posts">채널이 없습니다.</p>
        )}
      </div>
      <div>
        <PaginationComponent
          activePage={activePage} // 현재 활성화된 페이지 전달
          itemsCountPerPage={itemsCountPerPage} // 페이지당 항목 수 전달
          totalItemsCount={totalItemsCount} // 총 항목 수 전달
          pageRangeDisplayed={pageRangeDisplayed} // 표시할 페이지 범위 전달
          onChange={handlePageChange} // 페이지 변경 시 호출할 함수 전달
        />
      </div>
    </>
  );
}
export default GetSubscribeChannels;
