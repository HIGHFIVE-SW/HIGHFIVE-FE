import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, 
    createReview, getPost, updatePost, 
    deletePost, togglePostLike, getPostsByLikes,
    createActivityReview, createNewActivityReview,
    getReview, toggleReviewLike, getUserReviews, getUserPosts,
    getMyReviews, getMyPosts, getMyKeywordStats, getMyActivityTypeStats, getUserKeywordStats, getUserActivityTypeStats, searchReviews, searchPosts } from '../api/PostApi';

// 자유 게시판 게시물 목록 조회
export const usePosts = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['posts', page, size],
    queryFn: () => getPosts(page, size),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 자유 게시판 게시물 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['posts']);
      console.log('자유 게시판 작성 성공:', data);
    },
    onError: (error) => {
      console.error('자유 게시판 작성 실패:', error);
    }
  });
};

// 후기 게시판 게시물 생성
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['reviews']);
      console.log('후기 게시판 작성 성공:', data);
    },
    onError: (error) => {
      console.error('후기 게시판 작성 실패:', error);
    }
  });
};

// 게시물 상세 조회
export const usePost = (postId) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) return null;  // ID가 null이면 API 호출하지 않음
      return await getPost(postId);
    },
    enabled: !!postId,  // ID가 있을 때만 쿼리 실행
  });
};

// 게시물 수정 훅 추가
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, postData }) => updatePost(postId, postData),
    onSuccess: (data, variables) => {
      // 특정 게시물 쿼리 무효화
      queryClient.invalidateQueries(['post', variables.postId]);
      // 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries(['posts']);
      console.log('게시물 수정 성공:', data);
    },
    onError: (error) => {
      console.error('게시물 수정 실패:', error);
    }
  });
};

// 게시물 삭제 훅 추가
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (data, postId) => {
      // 특정 게시물 쿼리 무효화
      queryClient.invalidateQueries(['post', postId]);
      // 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries(['posts']);
      console.log('게시물 삭제 성공:', data);
    },
    onError: (error) => {
      console.error('게시물 삭제 실패:', error);
    }
  });
};

// 게시물 좋아요 토글 훅 추가
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: togglePostLike,
    onSuccess: (data, postId) => {
      // 특정 게시물 쿼리 무효화
      queryClient.invalidateQueries(['post', postId]);
      // 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries(['posts']);
      console.log('좋아요 토글 성공:', data);
    },
    onError: (error) => {
      console.error('좋아요 토글 실패:', error);
    }
  });
};

export const usePostsByLikes = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['posts', 'likes', page, size],
    queryFn: () => getPostsByLikes(page, size),
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 10, // 10분
  });
};

// 기존 활동에 대한 리뷰 생성
export const useCreateActivityReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ activityId, reviewData }) => createActivityReview(activityId, reviewData),
    onSuccess: (data) => {
      console.log('useCreateActivityReview 성공:', data);
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: (error) => {
      console.error('활동 리뷰 생성 실패:', error);
    },
    // 중복 실행 방지
    retry: false,
    // 동시에 같은 요청이 여러 번 실행되지 않도록 함
    networkMode: 'always'
  });
};

// 새로운 활동과 함께 리뷰 생성
export const useCreateNewActivityReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reviewData) => createNewActivityReview(reviewData),
    onSuccess: (data) => {
      console.log('useCreateNewActivityReview 성공:', data);
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['reviews']);
    },
    onError: (error) => {
      console.error('새 활동 리뷰 생성 실패:', error);
    },
    // 중복 실행 방지
    retry: false,
    // 동시에 같은 요청이 여러 번 실행되지 않도록 함
    networkMode: 'always'
  });
};

// 리뷰 게시판 특정 게시물 조회
export const useReview = (reviewId) => {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: async () => {
      if (!reviewId) return null;  // ID가 null이면 API 호출하지 않음
      return await getReview(reviewId);
    },
    enabled: !!reviewId,  // ID가 있을 때만 쿼리 실행
  });
};

// 후기 게시판 좋아요 토글 훅 추가
export const useToggleReviewLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleReviewLike,
    onSuccess: (data, reviewId) => {
      queryClient.invalidateQueries(['review', reviewId]);
      queryClient.invalidateQueries(['reviews']);
      console.log('리뷰 좋아요 토글 성공:', data);
    },
    onError: (error) => {
      console.error('리뷰 좋아요 토글 실패:', error);
    }
  });
};

// 특정 사용자의 리뷰 게시물 조회
export const useUserReviews = (userId, page = 0, options = {}) => {
  return useQuery({
    queryKey: ['userReviews', userId, page],
    queryFn: () => getUserReviews(userId, page),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  });
};

// 특정 사용자의 자유게시판 게시물 조회
export const useUserPosts = (userId, page = 0, options = {}) => {
  return useQuery({
    queryKey: ['userPosts', userId, page],
    queryFn: () => getUserPosts(userId, page),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  });
};

// 내가 쓴 리뷰 게시물 조회 (본인 프로필용)
export const useMyReviews = (page = 0, options = {}) => {
  return useQuery({
    queryKey: ['myReviews', page],
    queryFn: () => getMyReviews(page),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  });
};

// 내가 쓴 자유 게시판 게시물 조회 (본인 프로필용)
export const useMyPosts = (page = 0, options = {}) => {
  return useQuery({
    queryKey: ['myPosts', page],
    queryFn: () => getMyPosts(page),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  });
};

// 키워드별 내 활동 통계 조회
export const useMyKeywordStats = () => {
  return useQuery({
    queryKey: ['myKeywordStats'],
    queryFn: getMyKeywordStats,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
  });
};

// 활동 종류별 내 활동 통계 조회
export const useMyActivityTypeStats = () => {
  return useQuery({
    queryKey: ['myActivityTypeStats'],
    queryFn: getMyActivityTypeStats,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
  });
};

// 특정 사용자의 키워드별 활동 통계 조회
export const useUserKeywordStats = (userId) => {
  return useQuery({
    queryKey: ['userKeywordStats', userId],
    queryFn: () => getUserKeywordStats(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
  });
};

// 특정 사용자의 활동 종류별 통계 조회
export const useUserActivityTypeStats = (userId) => {
  return useQuery({
    queryKey: ['userActivityTypeStats', userId],
    queryFn: () => getUserActivityTypeStats(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
  });
};

// 리뷰 게시판 검색
export const useSearchReviews = (keyword, page = 0) => {
  return useQuery({
    queryKey: ['searchReviews', keyword, page],
    queryFn: () => searchReviews(keyword, page),
    enabled: !!keyword, // 키워드가 있을 때만 검색 실행
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

// 자유 게시판 검색
export const useSearchPosts = (keyword, page = 0) => {
  return useQuery({
    queryKey: ['searchPosts', keyword, page],
    queryFn: () => searchPosts(keyword, page),
    enabled: !!keyword, // 키워드가 있을 때만 검색 실행
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};
