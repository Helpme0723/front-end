import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getChannelInsights, findChannel } from '../apis/channel'; // 통계 데이터를 가져오는 API 함수
import '../styles/components/ChannelInsight.css';

const ChannelInsights = () => {
  const { channelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [channelInfo, setChannelInfo] = useState(null); // 채널 정보 상태 추가
  const [dailyInsights, setDailyInsights] = useState([]);
  const [monthlyInsights, setMonthlyInsights] = useState([]);
  const [hasInsights, setHasInsights] = useState(true); // 통계 여부 상태 추가

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return {
      userId: params.get('userId') || false,
    };
  }, [location.search]);

  useEffect(() => {
    const fetchChannelInfo = async () => {
      try {
        const response = await findChannel(channelId);
        setChannelInfo(response.data);
      } catch (error) {
        console.log('Error fetching channel info:', error.message);
      }
    };

    fetchChannelInfo();
  }, [channelId]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { userId } = getQueryParams();
        console.log(
          'Fetching insights for channel:',
          channelId,
          'with userId:',
          userId,
        );
        const response = await getChannelInsights(channelId, userId);

        console.log('Fetched data:', response);

        if (!response.data) {
          setHasInsights(false);
        } else {
          setDailyInsights(
            response.data.dailyInsights ? [response.data.dailyInsights] : [],
          );
          setMonthlyInsights(
            response.data.monthlyInsights
              ? [response.data.monthlyInsights]
              : [],
          );
          setHasInsights(true);
        }
      } catch (error) {
        console.log('Error fetching insights:', error.message);
        setHasInsights(false);
      }
    };

    fetchInsights();
  }, [channelId, location.search, getQueryParams]);

  if (!hasInsights) {
    return <div className="no-insights">통계가 없습니다</div>;
  }

  return (
    <div className="insights-container">
      <div className="channel-info-container">
        {channelInfo && (
          <div className="channel-info">
            <img
              src={channelInfo.channelImage}
              alt={channelInfo.channelName}
              className="channel-image"
            />
            <div className="channel-details">
              <div className="channel-title">{channelInfo.channelName}</div>
              <div className="channel-subscribers">
                구독자: {channelInfo.subscribers}명
              </div>
              <div className="channel-description">
                {channelInfo.description}
              </div>
              <div className="channel-extra-info">123</div>
            </div>
          </div>
        )}
      </div>
      <div className="insights-data-container">
        <div className="insights-section">
          <div className="section-header">
            <h3>일별 통계</h3>
            <button
              className="insight-button"
              onClick={() => navigate(`/channel/${channelId}/insights/daily`)}
            >
              자세히
            </button>
          </div>
          <div className="insights-grid">
            {dailyInsights.length > 0 ? (
              dailyInsights.map((insight, index) => (
                <React.Fragment key={index}>
                  <div className="insight-card">
                    <div className="insight-card-title">조회수</div>
                    <div className="insight-card-value">
                      {insight.viewCount}
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-card-title">좋아요 수</div>
                    <div className="insight-card-value">
                      {insight.likeCount}
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-card-title">판매량</div>
                    <div className="insight-card-value">
                      {insight.salesCount}
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div>통계가 없습니다</div>
            )}
          </div>
        </div>
        <div className="insights-section">
          <div className="section-header">
            <h3>월별 통계</h3>
            <button
              className="insight-button"
              onClick={() => navigate(`/channel/${channelId}/insights/monthly`)}
            >
              자세히
            </button>
          </div>
          <div className="insights-grid">
            {monthlyInsights.length > 0 ? (
              monthlyInsights.map((insight, index) => (
                <React.Fragment key={index}>
                  <div className="insight-card">
                    <div className="insight-card-title">조회수</div>
                    <div className="insight-card-value">
                      {insight.viewCount}
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-card-title">좋아요 수</div>
                    <div className="insight-card-value">
                      {insight.likeCount}
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-card-title">판매량</div>
                    <div className="insight-card-value">
                      {insight.salesCount}
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div>통계가 없습니다</div>
            )}
          </div>
        </div>
        <button
          className="back-button"
          onClick={() =>
            navigate(`/channels?userId=${getQueryParams().userId}`)
          }
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default ChannelInsights;
