import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findChannel } from '../apis/channel';
import '../styles/pages/FindChannel.css';

function FindChannel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [findChannelMessage, setFindChannelMessage] = useState('');

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const data = await findChannel(id);

        console.log(data.data);

        setChannel(data.data);
      } catch (error) {
        console.log('%%%%%%%%', error.message);
        setFindChannelMessage('Error Channel Find');
      }
    };
    fetchChannel();
  }, [id]);

  return (
    <div className="container">
      {findChannelMessage && <p>{findChannelMessage}</p>}
      {channel ? (
        <div>
          <div className="channel-info">
            <img src={channel.imageUrl} alt={channel.title} />
            <div className="channel-details">
              <label className="label">채널</label>
              <h1>{channel.title}</h1>
              <label className="label">채널 소개</label>
              <p>{channel.description}</p>
            </div>
          </div>
          <hr></hr>
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
          <hr></hr>
          <div className="posts-section">
            <label className="label">포스트</label>
            <div className="posts-list">
              {channel.posts.map(post => (
                <div className="post-item" key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <h3>{post.title}</h3>
                  </Link>
                  <p>카테고리: {post.category}</p>
                  {/* <p>Tags: {post.tags.join(', ')}</p> */}
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
