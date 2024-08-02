import React, { useEffect, useState } from 'react';
import { getSubscribes } from '../apis/auth';
import '../styles/pages/GetSubscribe.css';

function GetSubscribeChannels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChanels = async () => {
      try {
        const data = await getSubscribes();

        setChannels(data.data.subscribes);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchChanels();
  }, []);
  return (
    <div className="container">
      <h1>구독한 채널</h1>
      {channels.length > 0 ? (
        <ul>
          {channels.map((channel, index) => (
            <li key={index}>
              <h2>{channel.title}</h2>
              <img src={channel.imageUrl} alt={channel.title} />
              <p>{channel.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-posts">채널이 없습니다.</p>
      )}
    </div>
  );
}
export default GetSubscribeChannels;
