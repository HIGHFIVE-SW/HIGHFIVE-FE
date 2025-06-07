import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useActivityStore = create(
  persist(
    (set, get) => ({
      // 필터 상태
      fieldFilter: '전체',
      typeFilter: '전체',
      currentPage: 0,
      
      // 검색 관련
      searchKeyword: '',
      
      // 정렬 옵션
      sortBy: 'latest',
      
      // 필터 설정 메서드
      setFieldFilter: (filter) => set({ 
        fieldFilter: filter, 
        currentPage: 0 // 필터 변경 시 첫 페이지로 리셋
      }),
      
      setTypeFilter: (filter) => set({ 
        typeFilter: filter, 
        currentPage: 0 // 필터 변경 시 첫 페이지로 리셋
      }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setSearchKeyword: (keyword) => set({ 
        searchKeyword: keyword,
        currentPage: 0
      }),
      
      setSortBy: (sort) => set({ 
        sortBy: sort,
        currentPage: 0
      }),
      
      // 모든 필터 초기화
      resetFilters: () => set({ 
        fieldFilter: '전체', 
        typeFilter: '전체', 
        currentPage: 0,
        searchKeyword: '',
        sortBy: 'latest'
      }),
      
      // 페이지만 초기화
      resetPage: () => set({ currentPage: 0 }),
      
      // 현재 활성화된 필터 정보
      getActiveFilters: () => {
        const state = get();
        const filters = [];
        if (state.fieldFilter !== '전체') filters.push(state.fieldFilter);
        if (state.typeFilter !== '전체') filters.push(state.typeFilter);
        if (state.searchKeyword) filters.push(`검색: ${state.searchKeyword}`);
        return filters;
      },
      
      // 필터가 적용되었는지 확인
      hasActiveFilters: () => {
        const state = get();
        return state.fieldFilter !== '전체' || 
               state.typeFilter !== '전체' || 
               state.searchKeyword !== '';
      },
      
      // 현재 필터 상태를 객체로 반환
      getCurrentFilters: () => {
        const state = get();
        return {
          fieldFilter: state.fieldFilter,
          typeFilter: state.typeFilter,
          searchKeyword: state.searchKeyword,
          sortBy: state.sortBy,
          page: state.currentPage
        };
      }
    }),
    {
      name: 'activity-store', // localStorage 키
      partialize: (state) => ({ 
        fieldFilter: state.fieldFilter,
        typeFilter: state.typeFilter,
        sortBy: state.sortBy
      }), // 필요한 상태만 영구 저장
    }
  )
);
