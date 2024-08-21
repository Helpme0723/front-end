import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchPostDetails,
  createPostLike,
  deletePostLike,
  likeComment,
  unlikeComment,
  fetchComments,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  fetchChannelDetails,
  subscribeToChannel,
  getPostNotLogin,
  getPostLikeCheck,
  getCommentLikeCheck,
} from '../apis/post';
import '../styles/pages/PostDetail.css';
import AuthContext from '../context/AuthContext';
import { fetchPurchasedPosts } from '../apis/library';
import Pagination from '../components/Testpagenation';
import PurchasePost from './PurchasePost';
import { fetchUserDetails } from '../apis/user';

function PostDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(0);
  const [purchasedPosts, setPurchasedPosts] = useState([]); // 구매한 포스트 상태 추가
  const [newComment, setNewComment] = useState(''); // 새로운 댓글 입력 상태
  const [lastAddedCommentId, setLastAddedCommentId] = useState(null);
  const [isLikedPost, setIsLikedPost] = useState(false);
  const [isLikedComments, setIsLikedComments] = useState([false]);

  //채널 모달창
  const [channelModalIsOpen, setChannelModalIsOpen] = useState(false);
  const [channelDetails, setChannelDetails] = useState(null); // 채널 상세 정보 상태

  // 사용자 정보 모달창
  const [userModalIsOpen, setUserModalIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null); // 사용자 상세 정보 상태

  // 댓글용 사용자 정보 모달창
  const [commentUserModalIsOpen, setCommentUserModalIsOpen] = useState(false); // 댓글 사용자 모달 열림 상태
  const [commentUserDetails, setCommentUserDetails] = useState(null); // 댓글 작성자 정보
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // 모달 위치 상태

  //댓글 새로고침
  const fetchPostComments = async () => {
    setCommentsLoading(true);
    try {
      const response = await fetchComments(postId, commentsPage);
      if (response && response.data) {
        setComments(response.data.items);
        setTotalCommentPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 창 열기/닫기 상태
  const [selectedPostId, setSelectedPostId] = useState(null); // 선택된 포스트 ID 상태
  // 모달 창 열기 함수
  const openModal = () => {
    setSelectedPostId(postId);
    setModalIsOpen(true);
  };

  // 모달 창 닫기 함수
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPostId(null);
  };

  //채널 모달창 열기
  const openChannelModal = () => {
    if (post && post.channelId) {
      fetchChannelDetails(post.channelId)
        .then(data => {
          setChannelDetails(data.data); // 채널 정보 저장
          setChannelModalIsOpen(true);
        })
        .catch(error =>
          console.error('Failed to fetch channel details:', error),
        );
    }
  };
  const closeChannelModal = () => {
    setChannelModalIsOpen(false);
  };

  // 사용자 모달창 열기
  const openUserModal = async () => {
    if (post && post.userId) {
      try {
        const userDetails = await fetchUserDetails(post.userId); // 사용자 정보 가져오기
        setUserDetails(userDetails.data); // 사용자 정보 저장
        setUserModalIsOpen(true);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    }
  };

  // 사용자 모달창 닫기
  const closeUserModal = () => {
    setUserModalIsOpen(false);
  };

  // 댓글용 사용자 모달창 열기
  const openCommentUserModal = async (userId, event) => {
    const rect = event.target.getBoundingClientRect(); // 이미지 위치 계산
    const modalPosition = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };

    try {
      const userDetails = await fetchUserDetails(userId); // 사용자 정보 가져오기
      setCommentUserDetails(userDetails.data);
      setModalPosition(modalPosition); // 모달 위치 설정
      setCommentUserModalIsOpen(true); // 모달 열기
    } catch (error) {
      console.error('Failed to fetch comment user details:', error);
    }
  };

  const closeCommentUserModal = () => {
    setCommentUserModalIsOpen(false);
    setCommentUserDetails(null); // 모달 닫을 때 사용자 정보 초기화
    setModalPosition({ top: 0, left: 0 }); // 모달 위치 초기화
  };

  useEffect(() => {
    // 로그인 하지 않았을 경우
    const fetchNotLoginDetail = async () => {
      setLoading(true);
      if (!postId) {
        console.error('No post ID provided');
        setLoading(false);
        return;
      }
      try {
        const response = await getPostNotLogin(postId);
        if (response && response.data) {
          setPost(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch post details:', error);
      } finally {
        setLoading(false);
      }
    };

    // 로그인했을 경우
    const fetchDetails = async () => {
      setLoading(true);
      if (!postId) {
        console.error('No post ID provided');
        setLoading(false);
        return;
      }
      try {
        const response = await fetchPostDetails(postId);

        if (response && response.data) {
          setPost(response.data);
        }

        const alreadyLikedPost = await getPostLikeCheck(postId);
        if (alreadyLikedPost) {
          setIsLikedPost(false);
        }
      } catch (error) {
        console.error('Failed to fetch post details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDetails();
    } else {
      fetchNotLoginDetail();
    }
  }, [isAuthenticated, postId]);

  useEffect(() => {
    //댓글 조회
    const fetchPostComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await fetchComments(postId, commentsPage);

        if (response && response.data) {
          setTotalCommentPages(response.data.meta.totalPages);

          const responseDataItems = response.data.items;

          setComments(response.data.items);

          if (isAuthenticated) {
            const alreadyLikedComments = await getCommentLikeCheck(
              Number(postId),
            );

            const updatedComments = responseDataItems.map(item => {
              const isLiked = alreadyLikedComments.data.some(
                comment => comment.commentId === item.id,
              );
              // 기존 item에 isCommentLiked 속성 추가
              return {
                ...item,
                isCommentLiked: isLiked,
              };
            });

            setComments(updatedComments);
          }
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchPostComments();
  }, [postId, isAuthenticated, commentsPage]);

  useEffect(() => {
    if (lastAddedCommentId) {
      // 특정 시간 후에 new-comment 클래스를 제거합니다.
      const timer = setTimeout(() => {
        setLastAddedCommentId(null);
      }, 1000); // 애니메이션 시간과 일치시킵니다.

      return () => clearTimeout(timer);
    }
  }, [lastAddedCommentId]);

  //댓글생성
  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
    if (newComment.length > 255) {
      alert('댓글은 최대 255글자까지 입력 가능합니다.');
      return;
    }

    const numericPostId = Number(postId); // postId를 숫자로 변환
    if (isNaN(numericPostId)) {
      // 변환된 값이 숫자인지 확인
      alert('잘못된 포스트 ID입니다.');
      return;
    }

    try {
      const response = await createComment(numericPostId, newComment);
      // 새로운 댓글을 배열의 시작 부분에 추가
      setComments(prevComments => [response.data, ...prevComments]); // 새 댓글을 기존 댓글 앞에 추가
      setNewComment(''); // 댓글 입력 초기화
      setLastAddedCommentId(response.data.id); // 새로 추가된 댓글 ID를 저장
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  //포스트 삭제
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 포스트를 삭제하시겠습니까?')) return;
    try {
      await deletePost(postId);
      alert('포스트가 삭제되었습니다.');
      navigate('/'); // 홈 페이지로 리다이렉트
    } catch (error) {
      // 오류 응답에 따른 조건부 경고 메시지 처리
      if (error.status === 404) {
        alert('해당포스트를 찾을 수 없거나, 삭제권한이 없습니다.');
      } else if (error.status === 403) {
        alert('삭제 권한이 없습니다.');
      } else {
        alert(error.message); // 다른 오류 메시지 출력
      }
      console.error('Failed to delete post:', error);
    }
  };

  //포스트좋아요
  const handleLike = async () => {
    try {
      await createPostLike(postId);
      setIsLikedPost(true);
      setPost(prevPost => ({
        ...prevPost,
        likeCount: prevPost.likeCount + 1,
      }));
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert(
              '비공개 처리된 포스트이거나, 내 포스트에는 좋아요를 누를 수 없습니다.',
            );
            break;
          case 404:
            alert('포스트를 찾을 수 없습니다.');
            break;
          case 409:
            alert('이미 좋아요를 눌렀습니다.');
            break;
          default:
            console.error('Failed to like post:', error);
        }
      } else {
        console.error('Failed to like post:', error);
      }
    }
  };

  //포스트 좋아요 취소
  const handleUnlike = async () => {
    try {
      await deletePostLike(postId);
      setIsLikedPost(false);
      setPost(prevPost => ({
        ...prevPost,
        likeCount: prevPost.likeCount - 1,
      }));
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert('비공개 처리된 포스트입니다.');
            break;
          case 404:
            alert('좋아요를 누르지 않은 포스트입니다.');
            break;
          default:
            console.error('Failed to unlike post:', error);
        }
      } else {
        console.error('Failed to unlike post:', error);
      }
    }
  };
  // 포스트 좋아요, 좋아요 취소 통합
  const handleTogglePostLike = async () => {
    try {
      if (isLikedPost) {
        await handleUnlike();
      } else {
        await handleLike();
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  //댓글 좋아요
  const handleCommentLike = async commentId => {
    try {
      await likeComment(commentId);
      setIsLikedComments(true); // 상태 토글
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                likeCount: comment.likeCount + 1,
                isCommentLiked: true,
              }
            : comment,
        ),
      );
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert('본인의 댓글에는 좋아요를 누를 수 없습니다.');
            break;
          case 409:
            alert('이미 이 댓글에 좋아요를 눌렀습니다.');
            break;
          default:
            console.error('댓글 좋아요 실패:', error);
        }
      } else {
        console.error('댓글 좋아요 실패:', error);
      }
    }
  };

  //댓글 좋아요 취소
  const handleCommentUnlike = async commentId => {
    try {
      await unlikeComment(commentId);

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                likeCount: comment.likeCount - 1,
                isCommentLiked: false,
              }
            : comment,
        ),
      );
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            alert('좋아요를 누르지 않은 댓글입니다.');
            break;
          default:
            alert('좋아요를 먼저 누르세요.');
        }
      } else {
        console.error('댓글 좋아요 취소 실패:', error);
      }
    }
  };

  // 댓글 좋아요, 좋아요 취소 통합
  const handleToggleCommentLike = async (commentId, isCommentLiked) => {
    try {
      if (isCommentLiked) {
        await handleCommentUnlike(commentId);
      } else {
        await handleCommentLike(commentId);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  //댓글 수정
  const handleUpdateComment = async (commentId, newContent) => {
    if (!newContent.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }
    if (newContent.length > 255) {
      alert('댓글은 최대 255글자까지 입력 가능합니다.');
      return;
    }

    try {
      await updateComment(commentId, newContent);
      await fetchPostComments(); // 댓글 수정 후 댓글 목록 갱신
      alert('댓글이 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  //댓글 삭제
  const handleDeleteComment = async commentId => {
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId),
      );
      alert('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handlePrevCommentsPage = () => {
    setCommentsPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextCommentsPage = () => {
    setCommentsPage(prevPage =>
      prevPage < totalCommentPages ? prevPage + 1 : prevPage,
    );
  };

  //구독하기
  const handleSubscribe = async () => {
    try {
      const result = await subscribeToChannel(post.channelId);
      alert(result.message);
      // 성공적으로 구독했다면 채널 정보를 다시 불러옴
      openChannelModal();
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error.response?.data?.message || '구독을 완료하지 못했습니다.');
    }
  };

  if (loading) return <div>로딩중....</div>;
  if (!post)
    return (
      <div>
        해당 포스트를 찾을 수 없습니다(삭제된 포스트거나, 비공개 처리된
        포스트입니다)
      </div>
    );

  return (
    <div className="post-details-container">
      <h1>{post.title || '제목 없음'}</h1>
      <img
        src={post.userImage}
        alt={`Profile of ${post.nickname}`}
        className="profile-image"
        onClick={openUserModal} // 이미지 클릭 시 사용자 모달 열기
        style={{ cursor: 'pointer' }} // 마우스 커서가 손 모양으로 변경
      />
      <br></br>
      <div>작성자: {post.userName}</div>
      {post.channelTitle && (
        <div
          onClick={openChannelModal}
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          채널: {post.channelTitle}
        </div>
      )}
      <div>작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</div>
      <div>조회수: {post.viewCount}</div>
      <br></br>
      <p>{post.preview}</p>
      <div className={`modal-overlay ${channelModalIsOpen ? 'open' : ''}`}>
        <div className="modal">
          <h2>채널 정보</h2>
          {channelDetails ? (
            <>
              <img src={channelDetails.imageUrl} alt="채널이미지 없음" />
              <Link
                to={
                  userId === channelDetails.userId
                    ? `/channel/${post.channelId}` // 자신의 채널이면 이 경로로
                    : `/search/channel/${post.channelId}`
                } // 다른 사람의 채널이면 이 경로로
                style={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'black',
                }}
              >
                <h3
                  style={{
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  {channelDetails.title}
                </h3>
              </Link>
              <p>구독자 수: {channelDetails.subscribers}</p>
              <p>{channelDetails.description || '채널 설명이 없습니다.'}</p>
            </>
          ) : (
            <p>Loading channel details...</p>
          )}
          <button onClick={handleSubscribe} className="subscribe-button">
            구독하기
          </button>
          <button onClick={closeChannelModal} className="close-button">
            닫기
          </button>
        </div>
      </div>
      {post.content ? (
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        post.price > 0 && (
          <div className="purchase-callout">
            <p style={{ color: 'red' }}>
              이 콘텐츠는 구매 후에만 감상하실 수 있습니다.
            </p>
            <button onClick={openModal}>구매</button> {/* 모달 창 열기 버튼 */}
            <PurchasePost
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              post={post}
            />{' '}
            {/* 모달 창 컴포넌트 */}
          </div>
        )
      )}
      <div className="like-section">
        {/* <button onClick={handleLike} className="like-button">
          👍
        </button>
        <button onClick={handleUnlike} className="like-button">
          👎
        </button> */}
        <button onClick={handleTogglePostLike}>
          {isLikedPost ? '❤️' : '🤍'}
        </button>
        <span>좋아요 수: {post.likeCount}</span>
      </div>
      <div className="comments-container">
        <h2>댓글</h2>
        <div className="comment-input-container">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="comment-input"
          />
          <button onClick={handleCreateComment} className="comment-button">
            댓글 작성
          </button>
        </div>
        {commentsLoading ? (
          <div>댓글 로딩중....</div>
        ) : comments.length > 0 ? (
          <>
            {comments.map(comment => (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className={`comment ${comment.id === lastAddedCommentId ? 'new-comment' : ''}`} // 새 댓글에 애니메이션 클래스 적용
              >
                <div className="author-info">
                  <img
                    src={comment.user.profileUrl}
                    alt={`Profile of ${comment.user.nickname}`}
                    className="profile-image"
                    onClick={event =>
                      openCommentUserModal(comment.user.id, event)
                    } // 이벤트 객체 전달
                    style={{ cursor: 'pointer' }}
                  />
                  유저: {comment.user.nickname}
                </div>
                <div>
                  작성일:{' '}
                  {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <p>{comment.content}</p>
                <div className="comment-like-section">
                  {/* <button
                    onClick={() => handleCommentLike(comment.id)}
                    className="like-button"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleCommentUnlike(comment.id)}
                    className="like-button"
                  >
                    👎
                  </button> */}
                  <button
                    onClick={() =>
                      handleToggleCommentLike(
                        comment.id,
                        comment.isCommentLiked,
                      )
                    }
                  >
                    {comment.isCommentLiked ? '❤️' : '🤍'}
                  </button>
                  <span>좋아요 수: {comment.likeCount}</span>
                </div>
                <div className="comment-action-section">
                  {comment.userId === userId && ( // userId를 비교하여 조건부 렌더링
                    <>
                      <button
                        onClick={() => {
                          const newContent = prompt(
                            '수정할 내용을 입력하세요:',
                            comment.content,
                          );
                          if (newContent !== null) {
                            handleUpdateComment(comment.id, newContent);
                          }
                        }}
                        className="edit-button"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="comment-delete-button"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            <Pagination
              currentPage={commentsPage}
              totalPages={totalCommentPages}
              onPrevPage={handlePrevCommentsPage}
              onNextPage={handleNextCommentsPage}
            />
          </>
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
      <div>
        {post.userId === userId && (
          <div>
            <button
              onClick={() => navigate(`/post/${postId}/edit`)}
              className="post-edit-button"
            >
              수정
            </button>
            <button onClick={handleDelete} className="post-delete-button">
              삭제
            </button>
          </div>
        )}
      </div>
      <div className={`modal-overlay ${userModalIsOpen ? 'open' : ''}`}>
        <div className="modal">
          <h2>사용자 정보</h2>
          {userDetails ? (
            <>
              <img src={userDetails.profileUrl} alt="사용자 이미지" />
              <h3
                style={{
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                {userDetails.nickname}
              </h3>
              <p>이메일: {userDetails.email}</p>
              <p>
                가입일:{' '}
                {new Date(userDetails.createdAt).toLocaleDateString('ko-KR')}
              </p>
              <p>{userDetails.description || '소개글이 없습니다.'}</p>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
          <button
            onClick={() =>
              navigate(
                userDetails.id === userId
                  ? '/profile'
                  : `/user/${userDetails.id}`,
              )
            }
            className="navigate-button"
          >
            유저페이지
          </button>
          <button onClick={closeUserModal} className="close-button">
            닫기
          </button>
        </div>
      </div>
      {/* 댓글용 사용자 정보 모달 */}
      <div className={`modal-overlay ${commentUserModalIsOpen ? 'open' : ''}`}>
        <div
          className="modal"
          style={{
            position: 'fixed',
            top: '50%', // 화면의 세로 중앙
            left: '50%', // 화면의 가로 중앙
            transform: 'translate(-50%, -50%)', // 중앙에 모달을 정확히 맞춤
            zIndex: 1000, // 다른 요소들 위에 표시
          }}
        >
          <h2>댓글 작성자 정보</h2>
          {commentUserDetails ? (
            <>
              <img src={commentUserDetails.profileUrl} alt="사용자 이미지" />
              <h3 style={{ fontWeight: 'bold', margin: 0 }}>
                {commentUserDetails.nickname}
              </h3>
              <p>이메일: {commentUserDetails.email}</p>
              <p>
                가입일:{' '}
                {new Date(commentUserDetails.createdAt).toLocaleDateString(
                  'ko-KR',
                )}
              </p>
              <p>{commentUserDetails.description || '소개글이 없습니다.'}</p>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
          <button
            onClick={() =>
              navigate(
                commentUserDetails.id === userId
                  ? '/profile'
                  : `/user/${commentUserDetails.id}`,
              )
            }
            className="navigate-button"
          >
            유저페이지
          </button>
          <button onClick={closeCommentUserModal} className="close-button">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
export default PostDetailsPage;
