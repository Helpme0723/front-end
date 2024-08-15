import axiosInstance from './axiosInstance';

// Function to search posts using the Elasticsearch backend service
export const searchPosts = async (
  keyword,
  field = 'title',
  page = 1,
  limit = 10,
  sort = 'desc',
) => {
  console.log(
    `Searching posts with keyword=${keyword}, field=${field}, page=${page}, limit=${limit}, sort=${sort}`,
  );
  try {
    // Make a GET request to the search endpoint with query parameters
    const response = await axiosInstance.get('/api/search', {
      params: { keyword, field, page, limit, sort },
    });
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Search API error:', error.response?.data || error.message);
    throw error;
  }
};

export const searchRanking = async () => {
  try {
    const response = await axiosInstance.get('/api/search/ranking');
    return response.data;
  } catch (error) {
    throw error;
  }
};
