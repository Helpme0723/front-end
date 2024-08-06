import axiosInstance from './axiosInstance';

export const findAllMySeries = async (channelId, page, limit, sort) => {
  try {
    const response = await axiosInstance.get(`/api/series/my`, {
      params: { channelId, page, limit, sort },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('내 시리즈를 불러오는데 실패하였습니다', error);
    throw error;
  }
};

export const findAllSeries = async (channelId, page, limit, sort) => {
  try {
    const response = await axiosInstance.get(`api/series`, {
      params: { channelId, page, limit, sort },
    });
    return response.data;
  } catch (error) {
    console.error('시리즈를 전체조회 하는데', error);
    throw error;
  }
};
