// src/api/userAPI.js
import axios from 'axios';
import axiosInstance from './axiosInstance';

export const TIER_LABEL_MAP = {
  beginner: '초보 여행가',
  pro: '프로 탐험가',
  master: '글로벌 마스터',
  leader: '유니버스 리더'
};

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

// 로그인 API 추가
export const login = async (credentials) => {
  try {
    const response = await axiosInstance8080.post('/auth/login', credentials);
    
    console.log('로그인 응답:', response.data);
    
    if (response.data.isSuccess) {
      const userData = response.data.result;
      
      // localStorage에 사용자 정보 저장
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('nickname', userData.nickname);
      
      console.log('저장된 userId:', localStorage.getItem('userId'));
      
      return userData;
    } else {
      throw new Error(response.data.message || '로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error('로그인 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `로그인 실패 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('로그인 요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 로그아웃 API 추가
export const logout = async () => {
  try {
    // 서버에 로그아웃 요청 (필요한 경우)
    // await axiosInstance8080.post('/auth/logout');
    
    // localStorage 정리
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    
    console.log('로그아웃 완료');
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
    // 에러가 발생해도 localStorage는 정리
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
  }
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = () => {
  return {
    userId: localStorage.getItem('userId'),
    token: localStorage.getItem('token'),
    nickname: localStorage.getItem('nickname')
  };
};

// 로그인 상태 확인
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance8080.get('/users/profile');
    
    console.log('프로필 조회 응답:', response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '프로필 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('프로필 조회 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
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

// 사용자 프로필 수정
export const updateUserProfile = async (userData) => {
  try {
    console.log('프로필 수정 API 요청 데이터:', userData);

    const requestData = {
      nickname: userData.nickname,
      keyword: userData.keyword,
      profileUrl: userData.profileUrl
    };

    const response = await axiosInstance8080.patch('/users/profile/update', requestData);

    console.log('프로필 수정 서버 응답:', response.data);

    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '프로필 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('프로필 수정 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('프로필 수정 요청 처리 중 오류가 발생했습니다.');
    }
  }
};

export const getRankingByTier = async (tierKey) => {
  try {
    const response = await axiosInstance8080.get(`/users/rankings/${tierKey}`);
    console.log(`[${tierKey}] 티어 랭킹 조회 결과:`, response.data);

    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || '랭킹 조회 실패');
    }
  } catch (error) {
    console.error('티어 랭킹 API 호출 실패:', error);
    throw error;
  }
};

export const getPresignedUrl = async (imageName) => {
  try {
    const response = await axiosInstance8080.post('/users/presignedurls', {
      imageName: imageName
    });

    if (response.data.isSuccess) {
      return response.data.result.PresignedUrl;
    } else {
      throw new Error(response.data.message || 'PresignedUrl 발급에 실패했습니다.');
    }
  } catch (error) {
    console.error('PresignedUrl API 호출 실패:', error);
    throw error;
  }
};

// 프로필 이미지를 S3에 업로드
export const uploadProfileImage = async (file) => {
  try {
    // 파일명 생성
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    const imageName = `profile-${timestamp}-${randomString}.${extension}`;

    console.log('프로필 이미지 업로드 시작:', imageName);

    // Presigned URL 가져오기
    const presignedUrl = await getPresignedUrl(imageName);
    
    console.log('Presigned URL 발급 완료:', presignedUrl);

    // S3에 업로드
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      }
    });

    if (!response.ok) {
      throw new Error(`이미지 업로드 실패: ${response.status}`);
    }

    // 업로드된 이미지 URL 반환 (쿼리 파라미터 제거)
    const imageUrl = presignedUrl.split('?')[0];
    
    console.log('프로필 이미지 업로드 완료:', imageUrl);
    
    return imageUrl;

  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error);
    throw error;
  }
};
