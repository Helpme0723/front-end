import React from 'react';
import PostItem from '../components/PostItem';

function GetSubscribe(props) {
  return (
    <div>
      <h1>포스트 목록</h1>
      {props.postList.map((item) => (
        <PostItem item={item} />
      ))}
    </div>
  );
}
export default GetSubscribe;
