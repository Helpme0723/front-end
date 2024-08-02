import React, { useEffect, useState } from 'react';
import { getPostsFromSubscribeChannels } from '../apis/auth';
import '../styles/pages/GetPostsFromSubscribeChannels.css';
import PaginationComponent from '../components/pagination';

// 구독한 채널들의 포스트 목록 조회
function GetPostsFromSubscribeChannels() {
  const [posts, setPosts] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsCountPerPage = 10; // 페이지당 항목 수 설정
  const totalItemsCount = 100; // 총 항목 수 설정
  const pageRangeDisplayed = 5; // 표시할 페이지 범위 설정

  // 페이지 변경 시 호출되는 함수입니다.
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber); // 활성화된 페이지 상태 업데이트
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostsFromSubscribeChannels();
        console.log(data.data);
        setPosts(data.data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);

  // 현재 페이지에 해당하는 채널 계산
  const indexOfLastChannel = activePage * itemsCountPerPage;
  const indexOfFirstChannel = indexOfLastChannel - itemsCountPerPage;
  const currentChannels = posts.slice(indexOfFirstChannel, indexOfLastChannel);
  return (
    <>
      <h1> 구독한 채널의 포스트</h1>
      <div className="post">
        {currentChannels.length > 0 ? (
          <div className="post-header">
            <div className="post-info">
              {currentChannels.map((post, index) => (
                <div key={index}>
                  <div className="post-top">
                    <div className="post-title">{post.title}</div>
                  </div>
                  <div className="post-channelTitle">{post.channelTitle}</div>
                  <div className="post-container">
                    <div className="post-contents"></div>
                    <div className="post-contents-bottom"></div>
                  </div>
                  <div className="post-footer">
                    <div>
                      <img
                        className="post-channelImg"
                        src={post.channelImgUrl}
                      ></img>
                    </div>
                    <div className="post-ownerNickname">
                      닉네임:{post.ownerNickname}
                    </div>
                    <div className="post-point">point:{post.price}</div>
                    <div className="post-viewCount">
                      조회 수:{post.viewCount}
                    </div>
                    <div className="post-likeCount">
                      좋아요 수{post.likeCount}
                    </div>
                    <div className="post-commentCount">
                      댓글 수:{post.commentCount}
                    </div>
                    <div className="post-createdAt">
                      작성일자:{post.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-posts"> 포스트가 없습니다.</p>
        )}
      </div>
      <div>
        <PaginationComponent
          activePage={activePage} // 현재 활성화된 페이지 전달
          itemsCountPerPage={itemsCountPerPage} // 페이지당 항목 수 전달
          totalItemsCount={totalItemsCount} // 총 항목 수 전달
          pageRangeDisplayed={pageRangeDisplayed} // 표시할 페이지 범위 전달
          onChange={handlePageChange} // 페이지 변경 시 호출할 함수 전달
        />
      </div>
    </>
  );
}

export default GetPostsFromSubscribeChannels;
