// src/api/userAPI.js
import axios from 'axios';
import axiosInstance from './axiosInstance';

// 8080 포트의 axios 인스턴스 생성
const axiosInstance8080 = axios.create({
  baseURL: 'http://61.109.236.137:8080',
  timeout: 10000,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// 토큰 인터셉터 추가
axiosInstance8080.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('요청 설정 오류:', error);
  return Promise.reject(error);
});

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance8080.get('/users/profile');
    
    console.log('프로필 조회 응답:', response.data);
    
    // 응답 구조에 따라 조정 필요
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '프로필 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('프로필 조회 API 호출 실패:', error);
    
    if (error.response) {
      // 서버 응답이 있는 경우
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      // 네트워크 오류
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

export const setUserProfile = async (userData) => {
  try {
    console.log('API 요청 데이터:', userData);

    const requestData = {
      nickname: userData.nickname,
      keyword: userData.keyword,
      profileUrl: userData.profileUrl || "기본값"
    };

    const response = await axiosInstance8080.post('/users/profile', requestData);

    console.log('서버 응답:', response.data);

    if (!response.data || !response.data.isSuccess) {
      throw new Error(response.data?.message || '서버 응답이 올바르지 않습니다.');
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


