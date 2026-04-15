import { create } from 'zustand';

/**
 * Dashboard Store - Manages dashboard state for all roles
 */
export const useDashboardStore = create((set) => ({
  // Student Dashboard
  studentDashboard: {
    profile: null,
    progressStats: {},
    courses: [],
    notifications: [],
    certificates: [],
    subscription: null,
  },

  // Instructor Dashboard
  instructorDashboard: {
    metrics: {},
    courses: [],
    students: [],
    analytics: {},
  },

  // Admin Dashboard
  adminDashboard: {
    metrics: {},
    users: [],
    pendingCourses: [],
    transactions: [],
    analytics: {},
  },

  loading: false,
  error: null,

  // Actions
  setStudentDashboard: (data) =>
    set((state) => ({
      studentDashboard: { ...state.studentDashboard, ...data },
    })),

  setInstructorDashboard: (data) =>
    set((state) => ({
      instructorDashboard: { ...state.instructorDashboard, ...data },
    })),

  setAdminDashboard: (data) =>
    set((state) => ({
      adminDashboard: { ...state.adminDashboard, ...data },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      studentDashboard: {
        profile: null,
        progressStats: {},
        courses: [],
        notifications: [],
        certificates: [],
        subscription: null,
      },
      instructorDashboard: {
        metrics: {},
        courses: [],
        students: [],
        analytics: {},
      },
      adminDashboard: {
        metrics: {},
        users: [],
        pendingCourses: [],
        transactions: [],
        analytics: {},
      },
      error: null,
    }),
}));
