import axiosInstance from './axiosInstance';

export const setUserProfile = async (userData) => {
  try {
    const response = await axiosInstance.post('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
