import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

// ============================================================================
// AUTH HOOKS
// ============================================================================

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data.data; // Extract nested data from {success, message, data: {user, token}}
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data.data; // Extract nested data from {success, message, data: {user, token}}
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
  });
};

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: async (token) => {
      const response = await apiClient.post('/auth/verify', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });
};

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/student');
      return response.data;
    },
  });
};

export const useInstructorDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'instructor'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/instructor');
      return response.data;
    },
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/admin');
      return response.data;
    },
  });
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/metrics');
      return response.data;
    },
  });
};

// ============================================================================
// COURSE HOOKS
// ============================================================================

// Course Hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await apiClient.get('/courses');
      return response.data;
    },
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    },
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, data }) => {
      const response = await apiClient.put(`/courses/${courseId}/publish`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
      queryClient.invalidateQueries({ queryKey: ['courses'] });
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
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Chapter Hooks
export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, formData }) => {
      const response = await apiClient.post(`/courses/${courseId}/chapters`, formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses', data.courseId] });
    },
  });
};

export const useCompleteChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chapterId) => {
      const response = await apiClient.post(`/chapters/${chapterId}/complete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

// Exercise Hooks
export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chapterId, data }) => {
      const response = await apiClient.post(`/chapters/${chapterId}/exercises`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Syllabus Hooks
export const useSyllabi = () => {
  return useQuery({
    queryKey: ['syllabi'],
    queryFn: async () => {
      const response = await apiClient.get('/syllabus');
      return response.data;
    },
  });
};

export const useCourseSyllabuses = (courseId) => {
  return useQuery({
    queryKey: ['syllabi', courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${courseId}/syllabuses`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useSyllabus = (syllabusId) => {
  return useQuery({
    queryKey: ['syllabus', syllabusId],
    queryFn: async () => {
      const response = await apiClient.get(`/syllabuses/${syllabusId}`);
      return response.data;
    },
    enabled: !!syllabusId,
  });
};

export const useCreateSyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (syllabusData) => {
      const response = await apiClient.post('/syllabuses', syllabusData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabi'] });
    },
  });
};

export const useUpdateSyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ syllabusId, syllabusData }) => {
      const response = await apiClient.put(`/syllabuses/${syllabusId}`, syllabusData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabi'] });
    },
  });
};

export const useDeleteSyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (syllabusId) => {
      const response = await apiClient.delete(`/syllabuses/${syllabusId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabi'] });
    },
  });
};

export const useAddSyllabusOutline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ syllabusId, formData }) => {
      const response = await apiClient.post(`/syllabuses/${syllabusId}/outlines`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabi'] });
    },
  });
};

export const useUpdateSyllabusOutline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ outlineId, outlineData }) => {
      const response = await apiClient.put(`/syllabuses/outlines/${outlineId}`, outlineData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabi'] });
    },
  });
};

export const useDeleteSyllabusOutline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (outlineId) => {
      const response = await apiClient.delete(`/syllabuses/outlines/${outlineId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabi'] });
    },
  });
};

// Payment Hooks
export const usePreviewInvoice = ({ courseId, enabled = false }) => {
  return useQuery({
    queryKey: ['invoices', 'preview', courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/invoices/preview?courseId=${courseId}`);
      return response.data;
    },
    enabled: enabled && !!courseId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentData) => {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'user-invoices'] });
    },
  });
};

export const useUserInvoices = () => {
  return useQuery({
    queryKey: ['payments', 'user-invoices'],
    queryFn: async () => {
      const response = await apiClient.get('/payments/my-invoices');
      return response.data;
    },
  });
};

// Progress Hooks
export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const response = await apiClient.get('/progress');
      return response.data;
    },
  });
};

// Exercise/Exam Hooks
export const useChapterExercises = (chapterId) => {
  return useQuery({
    queryKey: ['exercises', chapterId],
    queryFn: async () => {
      const response = await apiClient.get(`/chapters/${chapterId}/exercises`);
      return response.data;
    },
    enabled: !!chapterId,
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chapterId, answers }) => {
      // Store exam submission locally since backend doesn't have a dedicated endpoint
      const examResult = {
        chapterId,
        answers,
        submittedAt: new Date().toISOString(),
        score: calculateScore(answers),
      };
      return examResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
};

// Helper function to calculate exam score
const calculateScore = (answers) => {
  if (!answers || answers.length === 0) return 0;
  
  let correctCount = 0;
  answers.forEach((answer) => {
    if (answer.isCorrect) {
      correctCount++;
    }
  });
  
  return Math.round((correctCount / answers.length) * 100);
};
// ============================================================================
// INSTRUCTOR SPECIFIC HOOKS
// ============================================================================

// Get enrolled students for a course
export const useCourseEnrollments = (courseId) => {
  return useQuery({
    queryKey: ['courses', courseId, 'enrollments'],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${courseId}/enrollments`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Get exercise attempts for a course
export const useCourseExerciseAttempts = (courseId) => {
  return useQuery({
    queryKey: ['courses', courseId, 'exercises', 'attempts'],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${courseId}/exercise-attempts`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Get all attempts for a course (Instructor view)
export const useCourseAllAttempts = (courseId) => {
  return useQuery({
    queryKey: ['courses', courseId, 'all-attempts'],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${courseId}/all-attempts`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useRecordExerciseAttempt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ exerciseId, answer, is_correct, score }) => {
      const response = await apiClient.post(`/courses/exercises/${exerciseId}/attempt`, {
        answer,
        is_correct,
        score,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// ============================================================================
// REVIEW HOOKS
// ============================================================================

export const useAllReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/reviews');
      return response.data.data?.reviews || response.data.reviews || [];
    },
  });
};

export const useCourseReviews = (courseId) => {
  return useQuery({
    queryKey: ['reviews', 'course', courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/course/${courseId}`);
      return response.data.data; // Extract from { success, message, data: { reviews, stats } }
    },
    enabled: !!courseId,
  });
};

export const useUserCourseReview = (courseId) => {
  return useQuery({
    queryKey: ['reviews', 'course', courseId, 'my-review'],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/course/${courseId}/my-review`);
      return response.data.data?.review || null; // Extract review from nested data
    },
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/reviews', data);
      return response.data;
    },
    onSuccess: (response, variables) => {
      const { course_id } = variables;
      // Invalidate course reviews
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', course_id] });
      // Invalidate user's review
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', course_id, 'my-review'] });
      // Invalidate all reviews queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, ...data }) => {
      const response = await apiClient.put(`/reviews/${reviewId}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId) => {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// ============================================================================
// PROGRESS HOOKS
// ============================================================================

export const useMarkChapterComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ chapter_id, course_id }) => {
      const response = await apiClient.post('/progress', {
        chapter_id,
        course_id,
      });
      return response.data;
    },
    onSuccess: (_, { course_id }) => {
      queryClient.invalidateQueries({ queryKey: ['progress', 'course', course_id] });
      queryClient.invalidateQueries({ queryKey: ['courses', course_id] });
    },
  });
};

export const useCourseProgress = (courseId) => {
  return useQuery({
    queryKey: ['progress', 'course', courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/progress/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

export const useAllCoursesProgress = () => {
  return useQuery({
    queryKey: ['progress', 'all-courses'],
    queryFn: async () => {
      const response = await apiClient.get('/progress');
      return response.data;
    },
  });
};

export const useCheckChapterCompletion = (chapterId) => {
  return useQuery({
    queryKey: ['progress', 'chapter', chapterId, 'status'],
    queryFn: async () => {
      const response = await apiClient.get(`/progress/chapter/${chapterId}/status`);
      return response.data.completed;
    },
    enabled: !!chapterId,
  });
};

// Get all students enrolled in instructor's courses
export const useInstructorStudents = () => {
  return useQuery({
    queryKey: ['instructor', 'students'],
    queryFn: async () => {
      const response = await apiClient.get('/instructor/students');
      return response.data;
    },
  });
};

// ============================================================================
// ADMIN GLOBAL DATA HOOKS
// ============================================================================

// Get all exercises across all courses (for admin)
export const useAllExercises = () => {
  return useQuery({
    queryKey: ['exercises', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/exercises');
      const data = response.data.data || response.data.exercises || response.data || [];
      return Array.isArray(data) ? data : (data?.exercises || data?.data || []);
    },
  });
};

// Get all enrollments across all courses (for admin)
export const useAllEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/courses/admin/all-enrollments');
      const data = response.data.data || response.data.enrollments || response.data || [];
      return Array.isArray(data) ? data : (data?.enrollments || data?.data || []);
    },
  });
};

// Get all syllabuses across all courses (for admin)
export const useAllSyllabuses = () => {
  return useQuery({
    queryKey: ['syllabuses', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/syllabuses');
      const data = response.data.data || response.data.syllabuses || response.data || [];
      return Array.isArray(data) ? data : (data?.syllabuses || data?.data || []);
    },
  });
};

// Get all syllabus outlines (for admin)
export const useAllSyllabusOutlines = () => {
  return useQuery({
    queryKey: ['syllabus-outlines', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/syllabuses/outlines');
      const data = response.data.data || response.data.outlines || response.data || [];
      return Array.isArray(data) ? data : (data?.outlines || data?.data || []);
    },
  });
};