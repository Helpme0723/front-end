import React, { useState, useEffect } from 'react';
import {
  getUnreadNotifications,
  getAllNotifications,
  markNotificationsAsRead,
} from '../apis/notifications';
import Pagination from '../components/Testpagenation'; // Pagination 컴포넌트 임포트
import '../styles/pages/Notification.css';

// 날짜 포맷 함수
const formatDate = dateString => {
  const date = new Date(dateString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC + 9시간으로 KST 변환
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return new Intl.DateTimeFormat('ko-KR', options).format(kstDate);
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewingAll, setViewingAll] = useState(true); // true면 모든 알림 조회, false면 읽지 않은 알림 조회

  useEffect(() => {
    // 초기 로드 시 모든 알림을 가져옵니다.
    fetchAllNotifications(1);
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const data = await getUnreadNotifications();
      setNotifications(data.data);
      setError(null);
      setViewingAll(false); // 읽지 않은 알림 조회 모드로 설정
    } catch (error) {
      setError('읽지 않은 알림을 가져오는 데 실패했습니다');
    }
  };

  const fetchAllNotifications = async page => {
    try {
      const data = await getAllNotifications(page);
      setNotifications(data.data.items);
      setTotalPages(Math.ceil(data.data.meta.totalItems / 10)); // 총 페이지 수 계산
      setError(null);
      setViewingAll(true); // 모든 알림 조회 모드로 설정
    } catch (error) {
      setError('모든 알림을 가져오는 데 실패했습니다');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsAsRead();
      alert('모든 알림이 읽음 처리되었습니다.');
      fetchUnreadNotifications(); // 모든 알림을 다시 불러오기
    } catch (error) {
      setError('알림을 읽음 처리하는 데 실패했습니다');
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchAllNotifications(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchAllNotifications(currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="noti-notifications-container">
      <h1 className="noti-title">알림 페이지</h1>
      <div className="noti-button-container">
        <button className="noti-button" onClick={fetchUnreadNotifications}>
          읽지 않은 알림
        </button>
        <button
          className="noti-button"
          onClick={() => fetchAllNotifications(1)}
        >
          모든 알림 조회
        </button>
      </div>
      {error && <div className="noti-error-message">{error}</div>}
      <ul className="noti-notifications-list">
        {notifications.length === 0 ? (
          <li className="noti-no-notifications">알림이 없습니다</li>
        ) : (
          notifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((notification, index) => (
              <li key={index} className="noti-notification-item">
                <div className="noti-notification-message">
                  {notification.message}
                </div>
                <div className="noti-notification-date">
                  {formatDate(notification.createdAt)}
                </div>
              </li>
            ))
        )}
      </ul>
      {/* 모든 알림 조회일 때만 페이지네이션 컴포넌트 표시 */}
      {viewingAll && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
      {/* 읽지 않은 알림일 때만 "모두 읽기" 버튼 표시 */}
      {!viewingAll && (
        <div className="noti-mark-all-read-container">
          <button
            className="noti-button noti-button-mark-read"
            onClick={handleMarkAllAsRead}
          >
            모두 읽기
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
