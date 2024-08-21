import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getPointHistory } from '../apis/pointhistory';
import '../styles/pages/PointHistory.css';

function PointHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [pointHistory, setPointHistory] = useState([]);
  const [type, setType] = useState('income');

  const handleChangeType = () => {
    setType(prevType => (prevType === 'income' ? 'outgoing' : 'income'));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getPointHistory(type, 'desc');
        const pointHistories = response.data || [];
        setPointHistory(pointHistories);
      } catch (error) {
        console.error('데이터를 불러오던 중 에러가 발생하였습니다', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  const formatDate = dateString => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // 날짜 형식이 유효하지 않다면 처리
      console.error('Invalid date format:', dateString);
      return 'Invalid Date';
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="point-history-container">
      <Link to="/point/charge">
        <button className="point-history-charge-button">포인트 충전하기</button>
      </Link>
      <h1 className="point-history-title">포인트 내역</h1>
      <div className="point-history-button-group">
        <button
          className={`point-history-button ${type === 'income' ? 'point-history-active' : 'point-history-inactive'}`}
          onClick={() => setType('income')}
        >
          포인트 충전 내역 보기
        </button>
        <button
          className={`point-history-button ${type === 'outgoing' ? 'point-history-active' : 'point-history-inactive'}`}
          onClick={() => setType('outgoing')}
        >
          포인트 사용 내역 보기
        </button>
      </div>
      {loading ? (
        <p className="point-history-loading">로딩 중...</p>
      ) : (
        <ul className="point-history-list">
          {pointHistory.map(item => (
            <li key={item.id} className="point-history-list-item">
              <p className="point-history-description">
                {item.description || 'No description available'}
              </p>
              <div className="point-history-details">
                <span className={`point-history-amount ${item.type}`}>
                  {item.amount.toLocaleString('ko-KR')}
                </span>
                <span className="point-history-type">
                  {item.type === 'INCOME' ? '원 충전' : '원 사용'}
                </span>
              </div>
              <span className="point-history-date">
                {formatDate(item.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PointHistoryPage;
