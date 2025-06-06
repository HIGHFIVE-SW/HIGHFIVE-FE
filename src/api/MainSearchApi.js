import axiosInstance from './axiosInstance';

export const searchIssues = async ({ keyword, page = 0, size = 4 }) => {
  const response = await axiosInstance.get('/issues/search', {
    params: {
      keyword,
      page,
      size
    }
  });
  return response.data;
};

export const searchAllIssues = async ({ keyword, page = 0, size = 12 }) => {
  const response = await axiosInstance.get('/issues/search', {
    params: {
      keyword,
      page,
      size
    }
  });
  return response.data;
};
