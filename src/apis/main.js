import axios from './axiosInstance';

export const fetchAllPosts = async (
  channelId,
  page = 1,
  limit = 9,
  sort = 'desc',
) => {
  try {
    const response = await axios.get('/api/posts', {
      params: { channelId, page, limit, sort },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchAllPostsLogIn = async (
  channelId,
  page = 1,
  limit = 9,
  sort = 'desc',
) => {
  try {
    const response = await axios.get('/api/posts/login', {
      params: { channelId, page, limit, sort },
    });
    console.log('####', response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
