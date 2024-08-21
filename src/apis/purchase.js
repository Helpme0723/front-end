import axiosInstance from './axiosInstance';

export const purchasePost = async postId => {
  try {
    const response = await axiosInstance.post('/api/purchases', { postId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
