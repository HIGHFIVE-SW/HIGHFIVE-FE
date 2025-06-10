// store/reviewLikeStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useReviewLikeStore = create(
  subscribeWithSelector((set, get) => ({
    likeMap: {}, // { [reviewId]: { liked: boolean, likeCount: number } }

    // 초기 좋아요 상태 설정
    setLike: (reviewId, liked, likeCount) =>
      set((state) => ({
        likeMap: {
          ...state.likeMap,
          [reviewId]: { liked, likeCount }
        }
      })),

    // 서버 응답으로 정확한 상태 동기화
    updateLike: (reviewId, liked, likeCount) =>
      set((state) => ({
        likeMap: {
          ...state.likeMap,
          [reviewId]: { liked, likeCount }
        }
      })),

    // Optimistic UI용 토글
    toggleLike: (reviewId) =>
      set((state) => {
        const prev = state.likeMap[reviewId] || { liked: false, likeCount: 0 };
        return {
          likeMap: {
            ...state.likeMap,
            [reviewId]: {
              liked: !prev.liked,
              likeCount: prev.likeCount + (prev.liked ? -1 : 1)
            }
          }
        };
      }),

    // 특정 리뷰의 좋아요 상태 가져오기
    getLikeState: (reviewId) => {
      const state = get();
      return state.likeMap[reviewId] || { liked: false, likeCount: 0 };
    },

    // 여러 리뷰의 좋아요 상태 일괄 설정 (리스트 페이지용)
    setBulkLikes: (reviews) =>
      set((state) => {
        const newLikeMap = { ...state.likeMap };
        reviews.forEach(review => {
          // 이미 존재하는 상태가 있다면 건드리지 않음 (사용자가 클릭한 상태 유지)
          if (!newLikeMap[review.id]) {
            newLikeMap[review.id] = {
              liked: review.liked || false,
              likeCount: review.likeCount || 0
            };
          }
        });
        console.log('setBulkLikes 실행:', { 
          기존상태: state.likeMap, 
          새상태: newLikeMap,
          받은리뷰들: reviews.map(r => ({ id: r.id, liked: r.liked, likeCount: r.likeCount }))
        });
        return { likeMap: newLikeMap };
      }),
  }))
);
