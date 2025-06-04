import { create } from 'zustand';

export const useActivityStore = create((set) => ({
  fieldFilter: '전체',
  typeFilter: '전체',
  currentPage: 0,
  setFieldFilter: (filter) => set({ fieldFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
