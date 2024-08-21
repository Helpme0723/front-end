import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMonthlyInsights, getMonthlySummaryInsight } from '../apis/channel';
import '../styles/pages/Insights.css';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FaCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from '../components/Testpagenation';
import AuthContext from '../context/AuthContext';

const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <button className="custom-date-input" onClick={onClick} ref={ref}>
    {value || '날짜 선택'}
    <FaCalendarAlt style={{ marginLeft: '10px' }} />
  </button>
));

function MonthlyInsights() {
  const { channelId } = useParams();
  const [monthlyInsights, setMonthlyInsights] = useState([]);
  const [sort, setSort] = useState('viewCount');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [summaryInsight, setSummaryInsight] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해 주세요.');
      navigate('/');
      return;
    }
  });

  useEffect(() => {
    const fetchMonthlyInsights = async () => {
      try {
        const formattedDate = selectedDate
          ? format(selectedDate, 'yyyy-MM')
          : undefined;
        const response = await getMonthlyInsights(
          channelId,
          formattedDate,
          sort,
          currentPage,
        );

        setMonthlyInsights(response.data);
        setTotalPages(response.data.meta?.totalPages);
      } catch (error) {
        console.log('Error fetching channel monthly insights:', error.message);
        setErrorMessage(error.response.data.message);
      }
    };
    fetchMonthlyInsights();
  }, [channelId, sort, selectedDate, currentPage]);

  useEffect(() => {
    const fetchSummaryInsight = async () => {
      try {
        const formattedDate = selectedDate
          ? format(selectedDate, 'yyyy-MM')
          : undefined;

        const response = await getMonthlySummaryInsight(
          channelId,
          formattedDate,
        );

        setSummaryInsight(response.data);
      } catch (error) {
        console.log(
          'Error fetching channel monthly summary insights:',
          error.message,
        );
        setErrorMessage(error.response.data.message);
      }
    };
    fetchSummaryInsight();
  }, [channelId, selectedDate]);

  const handleSortChange = e => {
    setSort(e.target.value);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="container">
      <div className="monthly-header-card">
        <div className="monthly-header">
          <h3>월별 통계</h3>
          {/* 여기에 새로운 통계 박스 추가 */}
          {summaryInsight ? (
            <div className="total-statistics">
              <div className="stat-card">
                <div className="stat-title">총 조회수</div>
                <div className="stat-value">{summaryInsight.viewCount}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">총 좋아요 수</div>
                <div className="stat-value">{summaryInsight.likeCount}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">총 댓글 수</div>
                <div className="stat-value">{summaryInsight.commentCount}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">총 판매량</div>
                <div className="stat-value">{summaryInsight.salesCount}</div>
              </div>
            </div>
          ) : (
            '통계가 집계되지 않았습니다.'
          )}

          <div className="controls">
            <div className="right-controls">
              <select
                className="sort-dropdown"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="viewCount">조회수</option>
                <option value="likeCount">좋아요 수</option>
                <option value="commentCount">댓글 수</option>
                <option value="salesCount">판매량</option>
              </select>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                placeholderText="날짜 선택"
                locale={ko}
                customInput={<CustomDateInput />}
                className="date-picker"
                calendarClassName="custom-calendar"
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="posts">
        {monthlyInsights.items && monthlyInsights.items.length > 0 ? (
          monthlyInsights.items.map((item, index) => (
            <div key={index} className="insights-post-card">
              <div className="post-title">포스트 제목: {item.title}</div>
              <div className="statistics">
                <div className="stat-card">
                  <div className="stat-title">조회수</div>
                  <div className="stat-value">{item.viewCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">좋아요 수</div>
                  <div className="stat-value">{item.likeCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">댓글 수</div>
                  <div className="stat-value">{item.commentCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">판매량</div>
                  <div className="stat-value">{item.salesCount}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            {errorMessage ? `${errorMessage}` : ' 통계가 집계되지 않았습니다.'}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
    </div>
  );
}

export default MonthlyInsights;
