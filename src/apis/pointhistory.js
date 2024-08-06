import axios from './axiosInstance';

export const getPointHistory = async (type = 'income', sort = 'desc') => {
  try {
    const response = await axios.get(`/api/point/history`, {
      params: { type, sort },
    });
    return response.data;
  } catch (error) {
    console.error('포인트증감내역을 불러오는것을 실패하였습니다', error);
    throw error;
  }
};
