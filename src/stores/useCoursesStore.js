import { create } from 'zustand';

/**
 * Courses Store - Manages courses and filtering state
 */
export const useCoursesStore = create((set) => ({
  courses: [],
  filters: {
    status: 'all', // all, in_progress, completed, not_started
    search: '',
    category: '',
    level: 'all', // all, beginner, intermediate, advanced
    page: 1,
    limit: 12,
  },
  pagination: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
  isLoading: false,

  // Actions
  setCourses: (courses) => set({ courses }),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters, page: 1 },
  })),

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 },
    })),

  setLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      courses: [],
      filters: {
        status: 'all',
        search: '',
        category: '',
        level: 'all',
        page: 1,
        limit: 12,
      },
      pagination: { total: 0, page: 1, totalPages: 1 },
    }),
}));
