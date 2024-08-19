import React, { useEffect, useState } from 'react';
import { getPostsFromSubscribeChannels } from '../apis/auth';
import '../styles/pages/GetPostsFromSubscribeChannels.css';
import Pagination from '../components/Testpagenation'; // 수정된 Pagination 컴포넌트를 가져옴
import { Link } from 'react-router-dom';

// 구독한 채널들의 포스트 목록 조회
function GetPostsFromSubscribeChannels() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 페이지당 항목 수 설정

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

  const totalPages = Math.ceil(posts.length / itemsPerPage); // 전체 페이지 수 계산

  const indexOfLastChannel = currentPage * itemsPerPage;
  const indexOfFirstChannel = indexOfLastChannel - itemsPerPage;
  const currentChannels = posts.slice(indexOfFirstChannel, indexOfLastChannel);

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); // 이전 페이지로 이동
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages)); // 다음 페이지로 이동
  };

  return (
    <>
      <h1> 구독한 채널의 포스트</h1>
      <div className="sub-post">
        {currentChannels.length > 0 ? (
          <div className="sub-post-header">
            <div className="sub-post-info">
              {currentChannels.map((post, index) => (
                <Link
                  to={`/post/${post.id}`}
                  key={index}
                  className="sub-post-link"
                >
                  <div className="sub-post-item">
                    <div className="sub-post-top">
                      <div className="sub-post-title">{post.title}</div>
                    </div>
                    <div className="sub-post-channelTitle">
                      {post.channelTitle}
                    </div>
                    <div className="sub-post-container">
                      <div className="sub-post-contents"></div>
                      <div className="sub-post-contents-bottom"></div>
                    </div>
                    <div className="sub-post-footer">
                      <div>
                        {post.channelImgUrl ? (
                          <img
                            className="sub-post-channelImg"
                            src={post.channelImgUrl}
                            alt={post.channelTitle}
                          />
                        ) : (
                          <div className="sub-post-no-image">이미지 없음</div>
                        )}
                      </div>
                      <div className="sub-post-ownerNickname">
                        닉네임: {post.ownerNickname}
                      </div>
                      <div className="sub-post-point">point: {post.price}</div>
                      <div className="sub-post-viewCount">
                        조회 수: {post.viewCount}
                      </div>
                      <div className="sub-post-likeCount">
                        좋아요 수: {post.likeCount}
                      </div>
                      <div className="sub-post-commentCount">
                        댓글 수: {post.commentCount}
                      </div>
                      <div className="sub-post-createdAt">
                        작성일자: {post.createdAt}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <p className="sub-post-no-posts"> 포스트가 없습니다.</p>
        )}
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      </div>
    </>
  );
}

export default GetPostsFromSubscribeChannels;
