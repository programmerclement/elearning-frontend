/**
 * Application-wide constants
 */

export const APP_NAME = 'Academia';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  LEARNER: 'learner',
};

// Course Status
export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING_APPROVAL: 'pending_approval',
};

// Enrollment Status
export const ENROLLMENT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Subscription Plans
export const PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ACADEMIA: 'academia',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  COURSE_UPDATE: 'course_update',
  PAYMENT: 'payment',
  CERTIFICATE: 'certificate',
  ANNOUNCEMENT: 'announcement',
};

// Course Categories
export const CATEGORIES = [
  { value: 'programming', label: 'Programming' },
  { value: 'business', label: 'Business' },
  { value: 'design', label: 'Design' },
  { value: 'language', label: 'Languages' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'personal-development', label: 'Personal Development' },
];

// Course Levels
export const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// Query Keys (for React Query)
export const QUERY_KEYS = {
  PROFILE: 'profile',
  COURSES: 'courses',
  COURSE_DETAIL: 'course-detail',
  DASHBOARD: 'dashboard',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  STUDENTS: 'students',
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  DEFAULT_PAGE: 1,
};

// File Upload Limits (MB)
export const UPLOAD_LIMITS = {
  VIDEO: 500,
  IMAGE: 5,
  DOCUMENT: 10,
};
