import axiosInstance from './axiosInstance';

export const createChannel = async (CreateChannelDto) => {
  try {
    const response = await axiosInstance.post(
      '/api/channels',
      CreateChannelDto
    );

    return response.data;
  } catch (error) {
    console.log('Error create channel', error.message);
    throw error;
  }
};

export const uploadImage = async (file) => {
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

export const findChannel = async (channelId) => {
  try {
    const response = await axiosInstance.get(`/api/channels/${channelId}`);

    return response.data;
  } catch (error) {
    console.log('Error Find Channel', error.message);
    throw error;
  }
};
