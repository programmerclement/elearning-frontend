import apiClient from './client';

// ============================================================================
// COURSES API
// ============================================================================

export const courseAPI = {
  // Get all courses with pagination and filtering
  listCourses: async (params = {}) => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  // Get single course with nested chapters and exercises
  getCourse: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  },

  // Create new course (instructor only)
  createCourse: async (courseData) => {
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  },

  // Publish course (draft -> published)
  publishCourse: async (courseId) => {
    const response = await apiClient.put(`/courses/${courseId}/publish`);
    return response.data;
  },

  // Delete course
  deleteCourse: async (courseId) => {
    const response = await apiClient.delete(`/courses/${courseId}`);
    return response.data;
  },
};

// ============================================================================
// CHAPTERS API
// ============================================================================

export const chapterAPI = {
  // Get single chapter
  getChapter: async (chapterId) => {
    const response = await apiClient.get(`/chapters/${chapterId}`);
    return response.data;
  },

  // Add chapter to course (with thumbnail upload)
  addChapter: async (courseId, chapterData) => {
    const formData = new FormData();
    formData.append('title', chapterData.title);
    formData.append('description', chapterData.description);
    if (chapterData.thumbnail) {
      formData.append('thumbnail', chapterData.thumbnail);
    }

    const response = await apiClient.post(
      `/courses/${courseId}/chapters`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Mark chapter as complete
  markChapterComplete: async (chapterId) => {
    const response = await apiClient.post(`/chapters/${chapterId}/complete`);
    return response.data;
  },
};

// ============================================================================
// EXERCISES API
// ============================================================================

export const exerciseAPI = {
  // Get all exercises in a chapter
  getExercises: async (chapterId) => {
    const response = await apiClient.get(`/chapters/${chapterId}/exercises`);
    return response.data;
  },

  // Add exercise to chapter
  addExercise: async (chapterId, exerciseData) => {
    const response = await apiClient.post(
      `/chapters/${chapterId}/exercises`,
      exerciseData
    );
    return response.data;
  },
};

// ============================================================================
// PAYMENTS & INVOICES API
// ============================================================================

export const paymentAPI = {
  // Get invoice preview before payment
  previewInvoice: async (courseId) => {
    const response = await apiClient.get('/invoices/preview', {
      params: { course_id: courseId },
    });
    return response.data;
  },

  // Process payment and enroll in course
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
  },
};

// ============================================================================
// DASHBOARD API
// ============================================================================

export const dashboardAPI = {
  // Get student dashboard data
  getStudentDashboard: async () => {
    const response = await apiClient.get('/dashboard/student');
    return response.data;
  },

  // Get instructor dashboard data
  getInstructorDashboard: async () => {
    const response = await apiClient.get('/dashboard/instructor');
    return response.data;
  },

  // Get admin dashboard data
  getAdminDashboard: async () => {
    const response = await apiClient.get('/dashboard/admin');
    return response.data;
  },

  // Get general metrics
  getMetrics: async () => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  },

  // Get lessons history
  getLessonsHistory: async () => {
    const response = await apiClient.get('/dashboard/lessons-history');
    return response.data;
  },
};

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await apiClient.post('/auth/verify', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
