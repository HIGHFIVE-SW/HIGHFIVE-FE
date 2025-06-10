import axios from 'axios';

const getBaseURL = () => {
  const path = window.location.pathname;
  
  // 환경변수에서 API URL 가져오기
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
  const fallbackUrl = process.env.REACT_APP_FALLBACK_API_URL || 'http://localhost:8080';
  
  if (
    path === '/' ||
    path.startsWith('/interest') ||
    path.startsWith('/oauth2') ||
    path.startsWith('/login')
  ) {
    return apiBaseUrl;
  }
  return fallbackUrl;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL() + '/api',
  timeout: 30000, // 30초로 증가
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  transformRequest: [(data) => {
    if (data instanceof FormData) {
      return data;
    }
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data);
    }
    return data;
  }]
});

axiosInstance.interceptors.request.use(config => {
  config.baseURL = getBaseURL() + '/api';
  const token = localStorage.getItem('Token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('요청 설정 오류:', error);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('서버 응답 오류:', error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('Token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('서버 응답 없음:', error.request);
    } else {
      console.error('요청 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
