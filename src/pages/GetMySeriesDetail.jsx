import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { deleteSeries, findMyOneSeries } from '../apis/series';
import '../styles/pages/SeriesDetail.css';

// 내 시리즈 상세 조회
function GetMySeriesDetail() {
  const { seriesId } = useParams();
  const [series, setSeries] = useState(null);
  const [ownerId, setOwnerId] = useState(null); // 시리즈를 만든 유저
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useContext(AuthContext); // 현재 접속한 유저

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const result = await findMyOneSeries(seriesId);

        setSeries(result.data);
        setOwnerId(result.data.userId);
      } catch (error) {
        console.log('Error fetching series data:', error.message);
        alert(error.response.data.message);
      }
    };
    fetchSeries();
  }, [seriesId]);

  // 시리즈 삭제
  const handleDeleteSeries = async () => {
    // 확인창 띄우기
    const confirmed = window.confirm('정말로 시리즈를 삭제하시겠습니까?');
    // 수락하지 않으면 끝내기
    if (!confirmed) {
      return;
    }

    try {
      // 수락하면 시리즈 삭제
      await deleteSeries(seriesId);
      alert('시리즈 삭제에 성공했습니다.');
      navigate(`/series/my`);
    } catch (error) {
      console.log('Error deleting series:', error.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="series-container">
      {series ? (
        <div>
          <div className="series-info">
            <div className="series-header">
              {isAuthenticated && ownerId === userId ? (
                <div className="series-button-container">
                  <button
                    className="series-update-button"
                    onClick={() => navigate(`/series/${seriesId}/update`)}
                  >
                    수정
                  </button>
                  <button
                    className="series-delete-button"
                    onClick={handleDeleteSeries}
                  >
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
            <div className="series-details">
              <label className="series-label">시리즈</label>
              <h1>{series.title}</h1>
              <label className="series-label">시리즈 소개</label>
              <p>{series.description}</p>
            </div>
          </div>
          <hr />
          <div className="series-posts-section">
            <div className="series-posts-header">
              <label className="series-label">포스트</label>
            </div>
            <div className="series-posts-list">
              {series.posts.map(post => (
                <div className="series-post-item" key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <p>카테고리: {post.category.category}</p>
                  <p>가격: {post.price.toLocaleString('ko-KR')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No series found</p>
      )}
    </div>
  );
}

export default GetMySeriesDetail;
