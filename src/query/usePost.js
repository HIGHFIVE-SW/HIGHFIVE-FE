import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, createPost, createReview, getPost, updatePost, deletePost, togglePostLike, getPostsByLikes } from '../api/PostApi';

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
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
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