import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store - Manages user authentication state
 * This might override/complement the existing AuthContext
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Actions
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true, loading: false }),

      updateUser: (user) => set({ user }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
