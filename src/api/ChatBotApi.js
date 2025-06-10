import axios from 'axios';

// 챗봇 전용 axios 인스턴스 생성
const chatbotInstance = axios.create({
  baseURL: 'http://central-01.tcp.tunnel.elice.io:50643',
  timeout: 30000, // 챗봇 응답은 시간이 좀 걸릴 수 있어서 15초로 설정
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// 요청 인터셉터에서 토큰 추가
chatbotInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('챗봇 요청 설정 오류:', error);
  return Promise.reject(error);
});

// 응답 인터셉터
chatbotInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('챗봇 서버 응답 오류:', error.response.data);
    } else if (error.request) {
      console.error('챗봇 서버 응답 없음:', error.request);
    } else {
      console.error('챗봇 요청 오류:', error.message);
    }
    return Promise.reject(error);
  }
);

// 챗봇 질문 API
export const askChatbot = async (userId, question) => {
  try {
    console.log('챗봇 질문 요청:', { userId, question });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/web`, {
      params: {
        question: question,
        request: 'ask'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('챗봇 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('챗봇 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 챗봇 대화 초기화 API
export const resetChatbot = async (userId) => {
  try {
    console.log('챗봇 대화 초기화 요청:', { userId });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/web`, {
      params: {
        question: '',
        request: 'reset'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('챗봇 초기화 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('챗봇 초기화 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 관심사 기반 추천 챗봇 질문 API
export const askChatbotHistoryRecommendation = async (userId, question) => {
  try {
    console.log('관심사 기반 추천 챗봇 질문 요청:', { userId, question });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/history-recommendation`, {
      params: {
        question: question,
        request: 'ask'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('관심사 기반 추천 챗봇 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('관심사 기반 추천 챗봇 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 관심사 기반 추천 챗봇 대화 초기화 API
export const resetChatbotHistoryRecommendation = async (userId) => {
  try {
    console.log('관심사 기반 추천 챗봇 대화 초기화 요청:', { userId });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/history-recommendation`, {
      params: {
        question: '',
        request: 'reset'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('관심사 기반 추천 챗봇 초기화 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('관심사 기반 추천 챗봇 초기화 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 분야 기반(키워드) 추천 챗봇 질문 API
export const askChatbotKeywordRecommendation = async (userId, question) => {
  try {
    console.log('분야 기반 추천 챗봇 질문 요청:', { userId, question });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/keyword-recommendation`, {
      params: {
        question: question,
        request: 'ask'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('분야 기반 추천 챗봇 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('분야 기반 추천 챗봇 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 분야 기반(키워드) 추천 챗봇 대화 초기화 API
export const resetChatbotKeywordRecommendation = async (userId) => {
  try {
    console.log('분야 기반 추천 챗봇 대화 초기화 요청:', { userId });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/keyword-recommendation`, {
      params: {
        question: '',
        request: 'reset'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('분야 기반 추천 챗봇 초기화 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('분야 기반 추천 챗봇 초기화 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 일상 대화(기타 질문) 챗봇 질문 API
export const askChatbotOthers = async (userId, question) => {
  try {
    console.log('일상 대화 챗봇 질문 요청:', { userId, question });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/others`, {
      params: {
        question: question,
        request: 'ask'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('일상 대화 챗봇 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('일상 대화 챗봇 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};

// 일상 대화(기타 질문) 챗봇 대화 초기화 API
export const resetChatbotOthers = async (userId) => {
  try {
    console.log('일상 대화 챗봇 대화 초기화 요청:', { userId });
    
    const response = await chatbotInstance.get(`/chatbot/${userId}/others`, {
      params: {
        question: '',
        request: 'reset'
      },
      timeout: 30000 // 30초로 타임아웃 연장
    });
    
    console.log('일상 대화 챗봇 초기화 응답:', response.data);
    
    return response.data.answer;
  } catch (error) {
    console.error('일상 대화 챗봇 초기화 API 호출 실패:', error);
    
    if (error.response) {
      throw new Error(error.response.data.message || `서버 오류 (${error.response.status})`);
    } else if (error.request) {
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      throw new Error('요청 처리 중 오류가 발생했습니다.');
    }
  }
};
