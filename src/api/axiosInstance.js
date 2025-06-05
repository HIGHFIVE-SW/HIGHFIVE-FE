import axios from 'axios';

const getBaseURL = () => {
  const path = window.location.pathname;
  // 로그인 관련 경로는 8080 포트 사용
  if (
    path === '/' ||
    path.startsWith('/interest') ||
    path.startsWith('/oauth2') ||
    path.startsWith('/login')
  ) {
    return 'http://61.109.236.137:8080';
  }
  // 나머지 API는 8000 포트 사용
  return 'http://61.109.236.137:8000';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
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
  config.baseURL = getBaseURL();
  const token = localStorage.getItem('token');
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
        localStorage.removeItem('token');
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
