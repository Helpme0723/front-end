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

// 내 시리즈 상세 조회
export const findMyOneSeries = async seriesId => {
  try {
    const response = await axiosInstance.get(`/api/series/${seriesId}/me`);

    return response.data;
  } catch (error) {
    console.error('시리즈 조회 실패', error.response.data.message);
    throw error;
  }
};

//타 유저의 시리즈 상세 조회
export const findOneSeries = async seriesId => {
  try {
    const response = await axiosInstance.get(`/api/series/${seriesId}`);

    return response.data;
  } catch (error) {
    console.error('시리즈 조회 실패', error.response.data.message);
    throw error;
  }
};

export const deleteSeries = async seriesId => {
  try {
    await axiosInstance.delete(`/api/series/${seriesId}`);

    return true;
  } catch (error) {
    console.error('시리즈 삭제 실패', error.response.data.message);
    throw error;
  }
};

// 시리즈 생성
export const createSeries = async (channelId, title, description) => {
  try {
    const response = await axiosInstance.post('api/series', {
      channelId,
      title,
      description,
    });

    return response.data;
  } catch (error) {
    console.error('시리즈 생성 실패', error.response.data.message);
    throw error;
  }
};

// 시리즈 수정
export const updateSeries = async (seriesId, channelId, title, description) => {
  try {
    const response = await axiosInstance.patch(`api/series/${seriesId}`, {
      channelId,
      title,
      description,
    });

    return response.data;
  } catch (error) {
    console.error('시리즈 수정 실패', error.response.data.message);
    throw error;
  }
};
