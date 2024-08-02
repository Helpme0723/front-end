import React, { useEffect, useState } from 'react';
import { getPostsFromSubscribeChannels } from '../apis/auth';

function GetPostsFromSubscribeChannels() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostsFromSubscribeChannels();

        setPosts(data.data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="container">
      <h1> 구독한 채널의 포스트</h1>
      {posts.length > 0 ? (
        <div className="posts-list-container">
          <div className="posts-list">
            <div className="post-container">
              <div className="post-contents"></div>
              <div className="post-contents-bottom"></div>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-posts"> 포스트가 없습니다.</p>
      )}
    </div>
  );
}

export default GetPostsFromSubscribeChannels;
