import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteChannel, findChannel } from '../apis/channel';
import '../styles/pages/FindChannel.css';
import AuthContext from '../context/AuthContext';

function FindChannel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, userId: currentUserId } = useContext(AuthContext);

  // 채널 상세 정보 가져오기
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const data = await findChannel(id);
        console.log(data.data);

        setChannel(data.data);
        setUserId(data.data.userId);
      } catch (error) {
        console.log('Error fetching channel data:', error.message);
      }
    };
    fetchChannel();
  }, [id]);

  // 채널 삭제
  const handleDeleteChannel = async () => {
    const confirmed = window.confirm('정말로 채널을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteChannel(id);
      alert('채널 삭제에 성공했습니다.');
      navigate(`/channels?userId=${userId}`);
    } catch (error) {
      console.log('Error deleting channel:', error.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="find-channel-container">
      {channel ? (
        <div>
          <div className="channel-info">
            <div className="channel-header">
              <img src={channel.imageUrl} alt={channel.title} />
              {isAuthenticated && currentUserId === userId ? (
                <div className="button-container">
                  <button
                    className="update-button"
                    onClick={() => navigate(`/channel/${id}/update`)}
                  >
                    수정
                  </button>
                  <button
                    className="delete-button"
                    onClick={handleDeleteChannel}
                  >
                    삭제
                  </button>
                </div>
              ) : null}
            </div>
            <div className="channel-details">
              <label className="label">채널</label>
              <h1>{channel.title}</h1>
              <label className="label">채널 소개</label>
              <p>{channel.description}</p>
            </div>
          </div>
          <hr />
          <div className="series-section">
            <label className="label">시리즈</label>
            <div className="series-list">
              {channel.series.map(series => (
                <div className="series-item" key={series.id}>
                  <h3>{series.title}</h3>
                  <p>{series.description}</p>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div className="posts-section">
            <label className="label">포스트</label>
            <div className="posts-list">
              {channel.posts.map(post => (
                <div className="post-item" key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <p>카테고리: {post.category}</p>
                  <p>가격: {post.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>No channel found</p>
      )}
    </div>
  );
}

export default FindChannel;
