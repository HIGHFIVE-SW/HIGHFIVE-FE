import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import activitiesApi from '../api/ActivitiesApi';
import { useActivityStore } from '../store/activityStore';

// 활동 목록 조회 (다중 필터 지원)
export const useActivities = () => {
  const { fieldFilter, typeFilter, currentPage } = useActivityStore();
  
  return useQuery({
    queryKey: ['activities', fieldFilter, typeFilter, currentPage],
    queryFn: async () => {
      return await activitiesApi.getActivities({
        page: currentPage,
        fieldFilter,
        typeFilter
      });
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    keepPreviousData: true, // 페이지네이션 시 이전 데이터 유지
    refetchOnWindowFocus: false,
  });
};

// 단일 활동 조회
export const useActivity = (activityId) => {
  return useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => activitiesApi.getActivity(activityId),
    enabled: !!activityId,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });
};

// 북마크한 활동 목록 조회
export const useBookmarkedActivities = (page = 0) => {
  return useQuery({
    queryKey: ['bookmarkedActivities', page],
    queryFn: () => activitiesApi.getBookmarkedActivities(page),
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });
};

// 북마크 토글
export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  const { fieldFilter, typeFilter, currentPage } = useActivityStore();
  
  return useMutation({
    mutationFn: (activityId) => activitiesApi.toggleBookmark(activityId),
    onMutate: async (activityId) => {
      // Optimistic update
      const activitiesQueryKey = ['activities', fieldFilter, typeFilter, currentPage];
      const bookmarkedQueryKey = ['bookmarkedActivities'];
      
      await queryClient.cancelQueries({ queryKey: activitiesQueryKey });
      await queryClient.cancelQueries({ queryKey: bookmarkedQueryKey });
      
      const previousActivitiesData = queryClient.getQueryData(activitiesQueryKey);
      const previousBookmarkedData = queryClient.getQueryData(bookmarkedQueryKey);
      
      // 활동 목록에서 북마크 상태 업데이트
      queryClient.setQueryData(activitiesQueryKey, (old) => {
        if (!old) return old;
        
        return {
          ...old,
          content: old.content.map((activity) =>
            activity.id === activityId || activity.activityId === activityId
              ? { ...activity, bookmarked: !activity.bookmarked }
              : activity
          )
        };
      });
      
      return { 
        previousActivitiesData, 
        previousBookmarkedData, 
        activitiesQueryKey,
        bookmarkedQueryKey 
      };
    },
    onError: (err, activityId, context) => {
      // 에러 시 롤백
      if (context?.previousActivitiesData) {
        queryClient.setQueryData(context.activitiesQueryKey, context.previousActivitiesData);
      }
      if (context?.previousBookmarkedData) {
        queryClient.setQueryData(context.bookmarkedQueryKey, context.previousBookmarkedData);
      }
      console.error('북마크 토글 실패:', err);
    },
    onSettled: () => {
      // 성공/실패 관계없이 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedActivities'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    }
  });
};

// 활동 데이터 프리페치
export const usePrefetchActivity = () => {
  const queryClient = useQueryClient();
  
  return (activityId) => {
    queryClient.prefetchQuery({
      queryKey: ['activity', activityId],
      queryFn: () => activitiesApi.getActivity(activityId),
      staleTime: 10 * 60 * 1000,
    });
  };
};

// 키워드로 활동 검색 (제한된 수)
export const useActivitiesByKeywordLimited = (keyword, options = {}) => {
  return useQuery({
    queryKey: ['activitiesByKeywordLimited', keyword],
    queryFn: () => activitiesApi.getActivitiesByKeywordLimited(keyword),
    enabled: !!keyword && options.enabled,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
