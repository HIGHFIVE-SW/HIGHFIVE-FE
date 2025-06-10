// hooks/useIssueSearch.js
import { useQuery } from '@tanstack/react-query';
import { searchIssues,searchActivities, searchAllActivities } from '../api/MainSearchApi';

export const useIssueSearch = (keyword, page = 0, enabled = false) => {
  return useQuery({
    queryKey: ['issues', 'search', keyword, page],
    queryFn: () => searchIssues({ keyword, page }),
    enabled: enabled && keyword?.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 활동 검색 훅 (자동완성용)
export const useActivitySearch = (keyword, enabled = true) => {
  return useQuery({
    queryKey: ['activities', 'search', keyword],
    queryFn: () => searchActivities({ keyword, page: 0, size: 8 }),
    enabled: enabled && keyword.length > 1,
    staleTime: 1000 * 60 * 3, // 3분
    cacheTime: 1000 * 60 * 5, // 5분
  });
};

// 전체 활동 검색 훅 (검색 페이지용)
export const useAllActivitiesSearch = (keyword, activityType, page = 0) => {
  return useQuery({
    queryKey: ['activities', 'search', 'all', keyword, activityType, page],
    queryFn: () => searchAllActivities({ 
      keyword, 
      activityType, 
      page, 
      size: 12 
    }),
    enabled: keyword.length > 0,
    staleTime: 1000 * 60 * 5, // 5분
    keepPreviousData: true, // 페이지네이션 시 이전 데이터 유지
  });
};
