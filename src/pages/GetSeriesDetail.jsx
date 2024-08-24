import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findOneSeries } from '../apis/series';
import { fetchAllPosts } from '../apis/main';
import '../styles/pages/SeriesDetail.css';

// 타 유저 시리즈 상세 조회
function GetSeriesDetail() {
  const { seriesId } = useParams();
  const [series, setSeries] = useState(null);
  const navigate = useNavigate();
  const [channelId, setChannelId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const result = await findOneSeries(seriesId);

        setSeries(result.data);
        setChannelId(result.data.channelId);
      } catch (error) {
        console.error('Error fetching series data:', error.message);
        alert(error.response.data.message);
      }
    };
    fetchSeries();
  }, [seriesId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await fetchAllPosts(
          null,
          null,
          limit,
          null,
          null,
          seriesId,
        );

        setPosts(result.data.posts);
      } catch (error) {
        console.error('Error fetching posts data:', error.message);
      }
    };
    fetchPosts();
  }, [seriesId]);

  return (
    <div className="series-container">
      {series ? (
        <div>
          <div className="series-info">
            <div className="series-header"></div>
            series
            <div className="series-details">
              <label className="series-label">시리즈</label>
              <h1>{series.title}</h1>
              <label className="series-label">시리즈 소개</label>
              <p>{series.description}</p>
            </div>
          </div>
          <hr />
          <hr />
          <div className="series-posts-section">
            <div className="series-posts-header">
              <label className="series-label">포스트</label>
            </div>
            <div className="series-posts-list">
              {posts.length > 0
                ? posts.map(post => (
                    <div
                      className="series-post-item"
                      key={post.id}
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <h3>{post.title}</h3>
                      <p>카테고리: {post.category}</p>
                      <p>가격: {post.price.toLocaleString('ko-KR')}</p>
                    </div>
                  ))
                : '포스트가 없습니다.'}
            </div>
          </div>
        </div>
      ) : (
        <p>No channel found</p>
      )}
    </div>
  );
}

export default GetSeriesDetail;
