import axiosInstance from './axiosInstance';

export const fetchLikedPosts = async (page = 1, limit = 5, order = 'desc') => {
  try {
    const response = await axiosInstance.get('/api/library/posts/likes', {
      params: { page, limit, order },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching liked posts: ${error.response?.data?.message || 'Unknown error'}`,
    );
    throw new Error(
      error.response?.data?.message || '좋아요한 포스트 조회 실패',
    );
  }
};

export const fetchPurchasedPosts = async (
  page = 1,
  limit = 10,
  order = 'desc',
) => {
  try {
    const response = await axiosInstance.get('/api/library/posts/purchases', {
      params: { page, limit, order },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching purchased posts: ${error.response?.data?.message || 'Unknown error'}`,
    );
    throw new Error(error.response?.data?.message || '구매한 포스트 조회 실패');
  }
};
