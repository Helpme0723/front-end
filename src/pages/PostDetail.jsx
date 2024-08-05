import React, { useEffect, useState,useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { fetchPostDetails, createPostLike, deletePostLike,likeComment,unlikeComment, fetchComments } from '../apis/post';
import '../styles/pages/PostDetail.css';
import AuthContext from '../context/AuthContext';
import { fetchPurchasedPosts } from '../apis/libray';

function PostDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(0);
  const [purchasedPosts, setPurchasedPosts] = useState([]); // 구매한 포스트 상태 추가

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/'); // 로그인하지 않은 사용자를 홈 페이지로 리다이렉트
      return;
    }

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
      } catch (error) {
        console.error('Failed to fetch post details:', error);
      } finally {
        setLoading(false);
      }
    };

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

    const loadPurchasedPosts = async () => {
      try {
        const purchasedResponse = await fetchPurchasedPosts();
        if (purchasedResponse && purchasedResponse.data && purchasedResponse.data.items) {
          // 구매한 포스트의 ID들을 추출하여 저장
          const purchasedIds = purchasedResponse.data.items.map(item => item.post.id.toString());
          setPurchasedPosts(purchasedIds);
        } else {
          console.log('No purchased posts returned:', purchasedResponse);
          setPurchasedPosts([]); // 아이템이 없는 경우 빈 배열 설정
        }
      } catch (error) {
        console.error('Failed to load purchased posts:', error);
      }
    };

    fetchDetails();
    fetchPostComments();
    loadPurchasedPosts(); // 구매한 포스트 로드
  }, [postId, isAuthenticated, navigate, commentsPage]);

  const isPostPurchased = purchasedPosts.includes(postId.toString()); // 현재 포스트 구매 여부 확인

  const handleLike = async () => {
    try {
      await createPostLike(postId);
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

  const handleUnlike = async () => {
    try {
      await deletePostLike(postId);
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

  const handleCommentLike = async commentId => {
    try {
      await likeComment(commentId);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, likeCount: comment.likeCount + 1 }
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

  const handleCommentUnlike = async commentId => {
    try {
      await unlikeComment(commentId);
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, likeCount: comment.likeCount - 1 }
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

  const handlePrevCommentsPage = () => {
    setCommentsPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextCommentsPage = () => {
    setCommentsPage(prevPage =>
      prevPage < totalCommentPages ? prevPage + 1 : prevPage,
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="post-details-container">
      <h1>{post.title || '제목 없음'}</h1>
      <div>작성자: {post.userName}</div>
      <div>작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</div>
      <div>조회수: {post.viewCount}</div>
      <br></br>
      <p>{post.preview}</p>
      {post.content ? (
        <p>{post.content}</p>
      ) : (
        post.price > 0 && (
          <div className="purchase-callout">
            이 이후의 내용은 포스트를 구매해야 보실 수 있습니다.
            <button onClick={() => console.log('구매 페이지로 이동')}>
              구매하기
            </button>
          </div>
        )
      )}
      <div className="like-section">
        <button onClick={handleLike} className="like-button">
          👍
        </button>
        <button onClick={handleUnlike} className="like-button">
          👎
        </button>
        <span>좋아요 수: {post.likeCount}</span>
      </div>
      <div className="comments-container">
        <h2>댓글</h2>
        {commentsLoading ? (
          <div>Loading comments...</div>
        ) : comments.length > 0 ? (
          <>
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <p>{comment.content}</p>
                <div>작성자 ID: {comment.userId}</div>
                <div>
                  작성일:{' '}
                  {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                </div>
                <div className="comment-like-section">
                  <button
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
                  </button>
                  <span>좋아요 수: {comment.likeCount}</span>
                </div>
              </div>
            ))}
            <div className="pagination">
              <button
                onClick={handlePrevCommentsPage}
                disabled={commentsPage === 1}
              >
                이전
              </button>
              <span>
                페이지 {commentsPage} / {totalCommentPages}
              </span>
              <button
                onClick={handleNextCommentsPage}
                disabled={commentsPage === totalCommentPages}
              >
                다음
              </button>
            </div>
          </>
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
export default PostDetailsPage;
