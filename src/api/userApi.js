import axiosInstance from './axiosInstance';

export const setUserProfile = async (userData) => {
  try {
    console.log('API 요청 데이터:', userData);

    const requestData = {
      nickname: userData.nickname,
      keyword: userData.keyword,
      profileUrl: userData.profileUrl || "기본값"
    };

    const response = await axiosInstance.post(
      '/users/profile',
      requestData
    );

    console.log('서버 응답:', response.data);

    if (!response.data) {
      throw new Error('서버 응답이 올바르지 않습니다.');
    }

    return response.data;
  } catch (error) {
    console.error('프로필 저장 API 호출 실패:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
