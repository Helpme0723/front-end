import axios from './axiosInstance';

export const getPurchaseDetails = async paymentId => {
  try {
    const response = await axios.get(`/api/points/details/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('결제정보를 불러오는대 실패하였습니다', error);
    throw error;
  }
};
