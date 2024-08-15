import axiosInstance from './axiosInstance';

// 읽지 않은 알림 조회
export const getUnreadNotifications = async () => {
  try {
    const response = await axiosInstance.get('/api/notifications/unread');
    return response.data; // 데이터만 반환
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

// 모든 알림 조회
export const getAllNotifications = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/api/notifications/all', {
      params: { page, limit },
    });
    return response.data; // 데이터만 반환
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    throw error;
  }
};

// 알림 읽음 처리
export const markNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.post('/api/notifications/read');
    return response.data;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};