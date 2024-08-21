import axios from './axiosInstance';

export const fetchAllPosts = async (
  channelId,
  page = 1,
  limit = 9,
  sort = 'desc',
  sortBy = 'createdAt',
  seriesId,
) => {
  try {
    const response = await axios.get('/api/posts', {
      params: { channelId, page, limit, sort, sortBy, seriesId },
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
  sortBy = 'createdAt',
) => {
  try {
    const response = await axios.get('/api/posts/login', {
      params: { channelId, page, limit, sort, sortBy },
    });
    console.log('####', response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
