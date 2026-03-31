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
  // Supports all new fields: subtitle, intro_message, duration_weeks, etc.
  createCourse: async (courseData) => {
    const response = await apiClient.post('/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    const response = await apiClient.put(`/courses/${courseId}`, courseData);
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
  // Supports: subtitle, intro_message, week_number, attachments
  addChapter: async (courseId, chapterData) => {
    const formData = new FormData();
    formData.append('title', chapterData.title);
    formData.append('description', chapterData.description || '');
    if (chapterData.subtitle) formData.append('subtitle', chapterData.subtitle);
    if (chapterData.intro_message) formData.append('intro_message', chapterData.intro_message);
    if (chapterData.week_number) formData.append('week_number', chapterData.week_number);
    if (chapterData.video_url) formData.append('video_url', chapterData.video_url);
    if (chapterData.duration) formData.append('duration', chapterData.duration);
    if (chapterData.attachments) {
      // Send as JSON stringified array
      formData.append('attachments', JSON.stringify(chapterData.attachments));
    }
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

  // Update chapter
  updateChapter: async (chapterId, chapterData) => {
    const response = await apiClient.put(`/chapters/${chapterId}`, chapterData);
    return response.data;
  },

  // Mark chapter as complete
  markChapterComplete: async (chapterId) => {
    const response = await apiClient.post(`/chapters/${chapterId}/complete`);
    return response.data;
  },

  // Delete chapter
  deleteChapter: async (chapterId) => {
    const response = await apiClient.delete(`/chapters/${chapterId}`);
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
  // Supports: question, type (radio/checkbox/text), options, correct_answer, points
  addExercise: async (chapterId, exerciseData) => {
    const response = await apiClient.post(
      `/chapters/${chapterId}/exercises`,
      exerciseData
    );
    return response.data;
  },

  // Update exercise
  updateExercise: async (exerciseId, exerciseData) => {
    const response = await apiClient.put(`/exercises/${exerciseId}`, exerciseData);
    return response.data;
  },

  // Delete exercise
  deleteExercise: async (exerciseId) => {
    const response = await apiClient.delete(`/exercises/${exerciseId}`);
    return response.data;
  },
};

// ============================================================================
// PAYMENTS & INVOICES API
// ============================================================================

export const paymentAPI = {
  // Get invoice preview before payment (with optional coupon)
  previewInvoice: async (courseId, couponCode = null) => {
    const params = { course_id: courseId };
    if (couponCode) params.coupon_code = couponCode;
    const response = await apiClient.get('/invoices/preview', { params });
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
  // Get general metrics
  getMetrics: async () => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  },

  // Get lessons history with pagination and search
  getLessonsHistory: async (page = 1, limit = 10, search = '', status = '') => {
    const params = { page, limit };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await apiClient.get('/dashboard/lessons-history', { params });
    return response.data;
  },

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
};

// ============================================================================
// SYLLABUSES API
// ============================================================================

export const syllabusAPI = {
  // List all syllabuses with pagination
  listSyllabuses: async (page = 1, limit = 10, status = '') => {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await apiClient.get('/syllabuses', { params });
    return response.data;
  },

  // Get single syllabus with outlines
  getSyllabus: async (syllabusId) => {
    const response = await apiClient.get(`/syllabuses/${syllabusId}`);
    return response.data;
  },

  // Create new syllabus
  createSyllabus: async (syllabusData) => {
    const response = await apiClient.post('/syllabuses', syllabusData);
    return response.data;
  },

  // Update syllabus
  updateSyllabus: async (syllabusId, syllabusData) => {
    const response = await apiClient.put(`/syllabuses/${syllabusId}`, syllabusData);
    return response.data;
  },

  // Add outline to syllabus
  addOutline: async (syllabusId, outlineData) => {
    const formData = new FormData();
    formData.append('title', outlineData.title);
    formData.append('abstract', outlineData.abstract || '');
    formData.append('description', outlineData.description || '');
    formData.append('order_index', outlineData.order_index || 0);
    if (outlineData.thumbnail) {
      formData.append('file', outlineData.thumbnail);
    }

    const response = await apiClient.post(
      `/syllabuses/${syllabusId}/outlines`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Delete syllabus
  deleteSyllabus: async (syllabusId) => {
    const response = await apiClient.delete(`/syllabuses/${syllabusId}`);
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

// ============================================================================
// FOLLOWERS API
// ============================================================================

export const followersAPI = {
  // Get followers of a user
  getFollowers: async (userId) => {
    const response = await apiClient.get('/followers', {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Get following list
  getFollowing: async (userId) => {
    const response = await apiClient.get('/followers/following', {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Check if following someone
  checkFollowing: async (followerId, followingId) => {
    const response = await apiClient.get('/followers/check', {
      params: { follower_id: followerId, following_id: followingId },
    });
    return response.data;
  },

  // Get follower stats
  getStats: async (userId) => {
    const response = await apiClient.get('/followers/stats', {
      params: { user_id: userId },
    });
    return response.data;
  },

  // Follow a user
  followUser: async (followerId, followingId) => {
    const response = await apiClient.post('/followers', {
      follower_id: followerId,
      following_id: followingId,
    });
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (followerId, followingId) => {
    const response = await apiClient.delete('/followers', {
      params: { follower_id: followerId, following_id: followingId },
    });
    return response.data;
  },
};

// ============================================================================
// USERS API
// ============================================================================

export const usersAPI = {
  // Get user profile by ID
  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};

// ============================================================================
// REVIEWS API
// ============================================================================

export const reviewAPI = {
  // List reviews with filtering
  listReviews: async (params = {}) => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },

  // Get single review
  getReview: async (reviewId) => {
    const response = await apiClient.get(`/reviews/${reviewId}`);
    return response.data;
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

// ============================================================================
// COUPONS API
// ============================================================================

export const couponAPI = {
  // List all coupons with pagination and filtering
  listCoupons: async (params = {}) => {
    const response = await apiClient.get('/coupons', { params });
    return response.data;
  },

  // Get single coupon
  getCoupon: async (couponId) => {
    const response = await apiClient.get(`/coupons/${couponId}`);
    return response.data;
  },

  // Create new coupon (admin only)
  createCoupon: async (couponData) => {
    const response = await apiClient.post('/coupons', couponData);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (couponId, couponData) => {
    const response = await apiClient.put(`/coupons/${couponId}`, couponData);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (couponId) => {
    const response = await apiClient.delete(`/coupons/${couponId}`);
    return response.data;
  },

  // Validate coupon for user
  validateCoupon: async (code, userId) => {
    const response = await apiClient.post('/coupons/validate', { code, user_id: userId });
    return response.data;
  },

  // Apply coupon to order
  applyCoupon: async (couponId, orderId) => {
    const response = await apiClient.post(`/coupons/${couponId}/apply`, { order_id: orderId });
    return response.data;
  },

  // Verify coupon is valid and active (public endpoint)
  verifyCoupon: async (couponCode) => {
    const response = await apiClient.get(`/coupons/verify/${couponCode}`);
    return response.data;
  },
};
