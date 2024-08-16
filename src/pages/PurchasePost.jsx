import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { purchasePost } from '../apis/purchase';
import ReactModal from 'react-modal';
import '../styles/pages/PurchasePost.css';

const customStyles = {
  content: {
    padding: '0', // CSS 파일에서 패딩 설정
    border: 'none', // CSS 파일에서 경계 설정
  },
};

ReactModal.setAppElement('#root');

function PurchasePost({ isOpen, onRequestClose, post }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [responseMessage, setResponseMessage] = useState(''); // 서버 응답 메시지 상태 관리

  // 폼 제출 처리 함수
  const handleSubmit = async event => {
    event.preventDefault(); // 폼 제출 기본 동작 막기
    try {
      const data = await purchasePost(post.postId); // 포스트 구매 API 호출
      setResponseMessage(data.message); // 응답 메시지 상태 업데이트
      alert(data.message);
      onRequestClose(); // 모달 닫기
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('Error purchasing post:', error); // 에러 로그 출력
      setResponseMessage('Error purchasing post'); // 에러 메시지 상태 업데이트
    }
  };

  const isLoginVerification = () => {
    if (!isAuthenticated) {
      alert('로그인 후 구매하실 수 있습니다.');
      navigate('/login');
    }
    return;
  };

  return (
    <ReactModal
      isOpen={isOpen} // 모달 창 열기/닫기 상태
      onRequestClose={onRequestClose} // 모달 창 닫기 함수
      style={customStyles} // 모달 창 스타일
      contentLabel="Purchase Post Modal" // 모달 창 접근성 라벨
    >
      <h2>포스트 구매</h2>
      <form className="purchase-form" onSubmit={handleSubmit}>
        <div>
          <label>제목: {post.title}</label>
          <label>가격: {post.price} 포인트</label>
        </div>
        <div className="button-container">
          <button type="submit" onClick={isLoginVerification}>
            구매
          </button>
          <button className="close-button" onClick={onRequestClose}>
            닫기
          </button>
        </div>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}{' '}
      {/* 응답 메시지 출력 */}
    </ReactModal>
  );
}

export default PurchasePost;
