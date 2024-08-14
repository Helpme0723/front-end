import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Switch from 'react-switch'; // Switch 컴포넌트 임포트
import AuthContext from '../context/AuthContext';
import {
  getNotificationSettings,
  toggleCommentNotifications,
  toggleLikeNotifications,
  togglePostLikeNotifications
} from '../apis/user';
import '../styles/pages/NotificationSettings.css';

function NotificationSettings() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    commentNotifications: false,
    commentlikeNotifications: false,
    postLikeNotifications: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    const fetchNotificationSettings = async () => {
      try {
        const data = await getNotificationSettings();
        setSettings(data.data);
      } catch (error) {
        console.error('알림 설정을 가져오지 못했습니다.', error);
      }
    };

    fetchNotificationSettings();
  }, [isAuthenticated, navigate]);

  const handleToggleCommentNotifications = async () => {
    try {
      const data = await toggleCommentNotifications();
      setSettings((prevSettings) => ({
        ...prevSettings,
        commentNotifications: data.data.commentNotifications,
      }));
    } catch (error) {
      console.error('댓글 알림 설정을 변경하지 못했습니다.', error);
    }
  };

  const handleToggleLikeNotifications = async () => {
    try {
      const data = await toggleLikeNotifications();
      setSettings((prevSettings) => ({
        ...prevSettings,
        commentlikeNotifications: data.data.commentlikeNotifications,
      }));
    } catch (error) {
      console.error('댓글 좋아요 알림 설정을 변경하지 못했습니다.', error);
    }
  };

  const handleTogglePostLikeNotifications = async () => {
    try {
      const data = await togglePostLikeNotifications();
      setSettings((prevSettings) => ({
        ...prevSettings,
        postLikeNotifications: data.data.postLikeNotifications,
      }));
    } catch (error) {
      console.error('포스트 좋아요 알림 설정을 변경하지 못했습니다.', error);
    }
  };

  return (
    <div className="noti-settings-container">
      <h2>알림 설정</h2>
      <div className="noti-setting">
        <label>
          댓글 알림
          <Switch
            checked={settings.commentNotifications}
            onChange={handleToggleCommentNotifications}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
          />
        </label>
      </div>
      <div className="noti-setting">
        <label>
          댓글 좋아요 알림
          <Switch
            checked={settings.commentlikeNotifications}
            onChange={handleToggleLikeNotifications}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
          />
        </label>
      </div>
      <div className="noti-setting">
        <label>
          포스트 좋아요 알림
          <Switch
            checked={settings.postLikeNotifications}
            onChange={handleTogglePostLikeNotifications}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
          />
        </label>
      </div>
    </div>
  );
}

export default NotificationSettings;
