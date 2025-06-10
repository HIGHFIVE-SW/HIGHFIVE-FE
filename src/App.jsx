// src/App.js
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from './routes/Route';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                    // 실패 시 1회만 재시도
      staleTime: 5 * 60 * 1000,   // 5분간 데이터를 fresh 상태로 유지
      cacheTime: 10 * 60 * 1000,  // 10분간 캐시 유지
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
    },
    mutations: {
      retry: 1,                    // 뮤테이션 실패 시 1회 재시도
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      {/* 개발 환경에서만 DevTools 표시 
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}*/}
    </QueryClientProvider>
  );
}
