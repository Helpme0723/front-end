import axiosInstance from './axiosInstance';

export const createChannel = async CreateChannelDto => {
  try {
    const response = await axiosInstance.post(
      '/api/channels',
      CreateChannelDto,
    );

    return response.data;
  } catch (error) {
    console.log('Error create channel', error.message);
    throw error;
  }
};

export const uploadImage = async file => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosInstance.post('/api/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findChannel = async channelId => {
  try {
    const response = await axiosInstance.get(`/api/channels/${channelId}`);

    return response.data;
  } catch (error) {
    console.log('Error Find Channel', error.message);
    throw error;
  }
};

// 유저의 채널 목록 조회
export const getUserChannels = async (userId, page, limit) => {
  try {
    const response = await axiosInstance.get(`/api/channels`, {
      params: { userId, page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '채널 목록 조회 실패');
  }
};

//실질 통계 호출
export const getChannelInsights = async channelId => {
  try {
    const response = await axiosInstance.get(
      `/api/channels/${channelId}/insights`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching channel insights:', error);
    throw error;
  }
};

export const getDailyInsights = async (channelId, date, sort, page) => {
  try {
    const response = await axiosInstance.get(
      `/api/channels/${channelId}/insights/daily`,
      {
        params: { date, sort, page },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching daily insights:', error);
    throw error;
  }
};

export const getMonthlyInsights = async (channelId, date, sort, page) => {
  try {
    const response = await axiosInstance.get(
      `/api/channels/${channelId}/insights/monthly`,
      {
        params: { date, sort, page },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching monthly insights:', error);
    throw error;
  }
};

export const deleteChannel = async channelId => {
  try {
    await axiosInstance.delete(`/api/channels/${channelId}`);
  } catch (error) {
    console.error('Error delete channel:', error);
    throw error;
  }
};

export const updateChannel = async (channelId, updateChannelData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/channels/${channelId}`,
      updateChannelData,
    );

    return response.data;
  } catch (error) {
    console.log('Error create channel', error.message);
    throw error;
  }
};
