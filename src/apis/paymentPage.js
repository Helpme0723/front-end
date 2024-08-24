import axiosInstance from './axiosInstance';

export const createOrder = async pointMenuId => {
  try {
    const response = await axiosInstance.post('/api/payments/orders', {
      pointMenuId,
    });
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const verifyPayment = async (merchantUid, impUid) => {
  const paymentDto = { merchantUid, impUid };
  try {
    const response = await axiosInstance.post(
      '/api/payments/complete',
      paymentDto,
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const refund = async impUid => {
  try {
    const response = await axiosInstance.post('/api/payments/refund', {
      impUid,
    });
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
