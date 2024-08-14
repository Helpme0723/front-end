import React, { useState, useEffect } from 'react';
import {
  getUnreadNotifications,
  getAllNotifications,
  markNotificationsAsRead,
} from '../apis/notifications';
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

  useEffect(() => {
    // 초기 로드 시 모든 알림을 가져옵니다.
    fetchAllNotifications();
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const data = await getUnreadNotifications();
      setNotifications(data.data);
      setError(null);
    } catch (error) {
      setError('읽지 않은 알림을 가져오는 데 실패했습니다');
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const data = await getAllNotifications();
      setNotifications(data.data);
      setError(null);
    } catch (error) {
      setError('모든 알림을 가져오는 데 실패했습니다');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markNotificationsAsRead();
      alert('모든 알림이 읽음 처리되었습니다.');
      fetchAllNotifications(); // 모든 알림을 다시 불러오기
    } catch (error) {
      setError('알림을 읽음 처리하는 데 실패했습니다');
    }
  };

  return (
    <div className="noti-notifications-container">
      <h1 className="noti-title">알림 페이지</h1>
      <div className="noti-button-container">
        <button className="noti-button" onClick={fetchUnreadNotifications}>
          읽지 않은 알림
        </button>
        <button className="noti-button" onClick={fetchAllNotifications}>
          모든 알림 조회
        </button>
        <button
          className="noti-button noti-button-mark-read"
          onClick={handleMarkAllAsRead}
        >
          모두 읽기
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
    </div>
  );
};

export default NotificationsPage;
