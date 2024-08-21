import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { findAllMySeries } from '../apis/series';
import '../styles/pages/MySeriesPage.css';
import Pagination from '../components/Testpagenation';

function MySeriesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const data = await findAllMySeries(null, page, limit, sort); // channelId 제거
        setSeries(data.data.series);
        setTotalPages(data.data.meta.totalPages);
      } catch (error) {
        console.error('내 시리즈를 불러오는데 실패하였습니다', error);
      }
      setLoading(false);
    };

    fetchSeries();
  }, [page, limit, sort]);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const handleSortChange = event => {
    setSort(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="title">내 시리즈 조회</h1>
      <div className="controls">
        <label htmlFor="sort">정렬:</label>
        <select id="sort" value={sort} onChange={handleSortChange}>
          <option value="asc">오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
      {loading ? (
        <p className="loading">로딩 중...</p>
      ) : (
        <ul className="list">
          {series.map(item => (
            <li
              key={item.id}
              className="list-item"
              onClick={() => navigate(`/series/${item.id}/my`)}
            >
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
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

export default MySeriesPage;
