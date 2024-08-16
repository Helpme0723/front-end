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
    <div className="container">
      <Link to="/point/charge">
        <button className="charge-button">포인트 충전하기</button>
      </Link>
      <h1 className="title">포인트 내역</h1>
      <button className="button" onClick={handleChangeType}>
        {type === 'income' ? '포인트 사용 내역 보기' : '포인트 충전 내역 보기'}
      </button>
      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : (
        <ul className="point-list">
          {pointHistory.map(item => (
            <li key={item.id} className="point-list-item">
              <p className="description">
                {item.description || 'No description available'}
              </p>
              <div className="details">
                <span className={`amount ${item.type}`}>
                  {item.type === 'INCOME' ? null : item.amount}
                </span>
                <span className="type">
                  {item.type === 'INCOME' ? null : '사용'}
                </span>
              </div>
              <span className="date">{formatDate(item.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PointHistoryPage;
