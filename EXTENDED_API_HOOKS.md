/**
 * Extended API Hooks - Building on existing useApi.js
 * These hooks should be added to or replace hooks in the existing useApi.js
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

// ============================================================================
// LEARNER DASHBOARD HOOKS
// ============================================================================

export const useStudentProfile = () => {
  return useQuery({
    queryKey: ['student', 'profile'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/student/profile');
      return response.data;
    },
  });
};

export const useStudentProgress = () => {
  return useQuery({
    queryKey: ['student', 'progress'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/student/progress');
      return response.data;
    },
  });
};

export const useStudentCourses = (params = {}) => {
  return useQuery({
    queryKey: ['student', 'courses', params],
    queryFn: async () => {
      const response = await apiClient.get('/courses/enrolled', { params });
      return response.data;
    },
  });
};

export const useStudentCertificates = () => {
  return useQuery({
    queryKey: ['student', 'certificates'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/student/certificates');
      return response.data;
    },
  });
};

export const useStudentNotifications = () => {
  return useQuery({
    queryKey: ['student', 'notifications'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/student/notifications');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await apiClient.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
    },
  });
};

export const useSubscriptionInfo = () => {
  return useQuery({
    queryKey: ['student', 'subscription'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/subscription');
      return response.data;
    },
  });
};

export const useAvailablePlans = () => {
  return useQuery({
    queryKey: ['payments', 'plans'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/available-plans');
      return response.data;
    },
  });
};

export const useUpgradePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (planId) => {
      const response = await apiClient.post('/payments/upgrade', { planId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'subscription'] });
    },
  });
};

export const useCourseEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId) => {
      const response = await apiClient.post(
        `/courses/${courseId}/enroll`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'student'] });
    },
  });
};

// ============================================================================
// INSTRUCTOR DASHBOARD HOOKS
// ============================================================================

export const useInstructorCourses = (params = {}) => {
  return useQuery({
    queryKey: ['instructor', 'courses', params],
    queryFn: async () => {
      const response = await apiClient.get('/courses/instructor', { params });
      return response.data;
    },
  });
};

export const useInstructorStudents = (courseId) => {
  return useQuery({
    queryKey: ['instructor', 'students', courseId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/courses/${courseId}/students`
      );
      return response.data;
    },
  });
};

export const useInstructorAnalytics = () => {
  return useQuery({
    queryKey: ['instructor', 'analytics'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/instructor/analytics');
      return response.data;
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseData) => {
      const response = await apiClient.post('/courses', courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, courseData }) => {
      const response = await apiClient.put(`/courses/${courseId}`, courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId) => {
      const response = await apiClient.delete(`/courses/${courseId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId) => {
      const response = await apiClient.patch(
        `/courses/${courseId}/publish`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
    },
  });
};

export const useUploadCourseContent = () => {
  return useMutation({
    mutationFn: async ({ courseId, chapterId, formData }) => {
      const response = await apiClient.post(
        `/courses/${courseId}/chapters/${chapterId}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },
  });
};

// ============================================================================
// ADMIN DASHBOARD HOOKS
// ============================================================================

export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users', { params });
      return response.data;
    },
  });
};

export const usePendingCourses = () => {
  return useQuery({
    queryKey: ['admin', 'courses', 'pending'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/courses/pending');
      return response.data;
    },
  });
};

export const useAdminPayments = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/payments/transactions', {
        params,
      });
      return response.data;
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const response = await apiClient.patch(`/admin/users/${userId}/suspend`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const response = await apiClient.patch(
        `/admin/users/${userId}/activate`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useApproveCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId) => {
      const response = await apiClient.post(
        `/admin/courses/${courseId}/approve`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

export const useRejectCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, reason }) => {
      const response = await apiClient.post(
        `/admin/courses/${courseId}/reject`,
        { reason }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/analytics/dashboard');
      return response.data;
    },
  });
};
