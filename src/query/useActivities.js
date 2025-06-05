// hooks/useActivities.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import activitiesApi from '../api/ActivitiesApi';
import { useActivityStore } from '../store/activityStore';

const KEYWORD_MAP = {
  '환경': 'Environment',
  '사람과사회': 'PeopleAndSociety',
  '경제': 'Economy',
  '기술': 'Technology'
};

const ACTIVITY_TYPE_MAP = {
  '봉사활동': 'VOLUNTEER',
  '공모전': 'CONTEST',
  '서포터즈': 'SUPPORTERS',
  '인턴십': 'INTERNSHIP'
};

// 활동 목록 조회
export const useActivities = () => {
  const { fieldFilter, typeFilter, currentPage } = useActivityStore();
  
  return useQuery({
    queryKey: ['activities', fieldFilter, typeFilter, currentPage],
    queryFn: async () => {
      // 필터 조건에 따라 적절한 API 호출
      if (fieldFilter !== '전체') {
        const keyword = KEYWORD_MAP[fieldFilter];
        if (keyword) {
          return await activitiesApi.getActivitiesByKeyword({
            keyword,
            page: currentPage
          });
        }
      }
      
      if (typeFilter !== '전체') {
        const activityType = ACTIVITY_TYPE_MAP[typeFilter];
        if (activityType) {
          return await activitiesApi.getActivitiesByType({
            activityType,
            page: currentPage
          });
        }
      }
      
      return await activitiesApi.getActivities({
        page: currentPage,
        fieldFilter,
        typeFilter
      });
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
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
      const queryKey = ['activities', fieldFilter, typeFilter, currentPage];
      
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: ['bookmarkedActivities'] });
      
      const previousData = queryClient.getQueryData(queryKey);
      
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        
        return {
          ...old,
          content: old.content.map((activity) =>
            activity.id === activityId
              ? { ...activity, bookmarked: !activity.bookmarked }
              : activity
          )
        };
      });
      
      return { previousData, queryKey };
    },
    onError: (err, activityId, context) => {
      // 에러 시 롤백
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 모든 관련 쿼리 무효화
      const queryKey = ['activities', fieldFilter, typeFilter, currentPage];
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedActivities'] });
    }
  });
};
