import axiosInstance from './axiosInstance';

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

export const updateUserInfo = async formData => {
  try {
    const response = await axiosInstance.patch('/api/users/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};

export const updateUserPassword = async updateUserPasswordDto => {
  try {
    const response = await axiosInstance.patch(
      '/api/users/me/password',
      updateUserPasswordDto,
    );
    return response.data;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

// 알림 설정 조회
export const getNotificationSettings = async () => {
  try {
    const response = await axiosInstance.get('/api/notifications/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw error;
  }
};

// 댓글 알림 설정 토글
export const toggleCommentNotifications = async () => {
  try {
    const response = await axiosInstance.post('/api/notifications/settings/comment');
    return response.data;
  } catch (error) {
    console.error('Error toggling comment notifications:', error);
    throw error;
  }
};

// 댓글 좋아요 알림 설정 토글
export const toggleLikeNotifications = async () => {
  try {
    const response = await axiosInstance.post('/api/notifications/settings/comment/like');
    return response.data;
  } catch (error) {
    console.error('Error toggling comment like notifications:', error);
    throw error;
  }
};

// 포스트 좋아요 알림 설정 토글
export const togglePostLikeNotifications = async () => {
  try {
    const response = await axiosInstance.post('/api/notifications/settings/post/like');
    return response.data;
  } catch (error) {
    console.error('Error toggling post like notifications:', error);
    throw error;
  }
};

// 구독 알림 설정 토글
export const toggleSubscribeNotifications = async () => {
  try {
    const response = await axiosInstance.post('/api/notifications/settings/subscribe');
    return response.data;
  } catch (error) {
    console.error('Error toggling subscribe notifications:', error);
    throw error;
  }
};

export const fetchUserDetails = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data; // 데이터만 반환
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};