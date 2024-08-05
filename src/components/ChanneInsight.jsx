import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getChannelInsights, getDailyInsights, getMonthlyInsights } from '../apis/channel'; // 통계 데이터를 가져오는 API 함수
import '../styles/components/ChannelInsight.css';

const ChannelInsights = () => {
  const { channelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
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
    const fetchInsights = async () => {
      try {
        const { userId } = getQueryParams();
        const data = await getChannelInsights(channelId, userId);
        const dailyData = await getDailyInsights(channelId, userId);
        const monthlyData = await getMonthlyInsights(channelId, userId);

        if (!data || !dailyData || !monthlyData) {
          setHasInsights(false);
        } else {
          setInsights(data);
          setDailyInsights(Array.isArray(dailyData.data) ? dailyData.data : []);
          setMonthlyInsights(Array.isArray(monthlyData.data) ? monthlyData.data : []);
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
      {insights && (
        <>
          <h2>{insights.channelName} 통계</h2>
          <div className="channel-info">
            <img src={insights.channelImage} alt={insights.channelName} className="channel-image" />
            <div className="channel-details">
              <div className="channel-title">{insights.channelName}</div>
              <div className="channel-description">{insights.description}</div>
              <div className="channel-subscribers">구독자: {insights.subscribers}</div>
            </div>
          </div>
        </>
      )}
      <div className="insights-section">
        <h3>일별 통계</h3>
        <div className="insights-grid">
          {dailyInsights.length > 0 ? (
            dailyInsights.map((insight, index) => (
              <div className="insight-card" key={index}>
                <div>날짜: {insight.date}</div>
                <div>조회수: {insight.views}</div>
                <div>좋아요 수: {insight.likes}</div>
                <div>판매액: {insight.sales}</div>
              </div>
            ))
          ) : (
            <div>통계가 없습니다</div>
          )}
        </div>
      </div>
      <div className="insights-section">
        <h3>월별 통계</h3>
        <div className="insights-grid">
          {monthlyInsights.length > 0 ? (
            monthlyInsights.map((insight, index) => (
              <div className="insight-card" key={index}>
                <div>월: {insight.month}</div>
                <div>조회수: {insight.views}</div>
                <div>좋아요 수: {insight.likes}</div>
                <div>판매액: {insight.sales}</div>
              </div>
            ))
          ) : (
            <div>통계가 없습니다</div>
          )}
        </div>
      </div>
      <button className="back-button" onClick={() => navigate(`/channels?userId=${getQueryParams().userId}`)}>목록으로</button>
    </div>
  );
};

export default ChannelInsights;
