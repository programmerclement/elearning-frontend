# E-Learning Frontend Architecture Guide

## System Overview
This is a multi-role e-learning platform with three distinct user types, each with their own dashboard and management interfaces.

---

## SECTION 1: ROLE-BASED ROUTING & STRUCTURE

### User Roles
1. **Learner** (student) - Consume courses, track progress, manage subscriptions
2. **Instructor** - Create, manage, and monitor courses and students
3. **Admin** - System-wide management, approvals, analytics

### Routing Structure
```
/login                              → Public
/register                           → Public
/
├── /student/
│   ├── /dashboard                  → Learner Dashboard
│   ├── /courses                    → My Courses (with filters)
│   ├── /courses/:courseId          → Course Details & Content
│   ├── /progress                   → Learning Progress
│   ├── /profile                    → User Profile (Editable)
│   ├── /certificates               → My Certificates
│   ├── /notifications              → Notifications Center
│   └── /payment-invoices           → Payment History & Subscriptions
│
├── /instructor/
│   ├── /dashboard                  → Instructor Overview
│   ├── /courses                    → My Courses (Create/Edit/Delete)
│   ├── /courses/:courseId/builder  → Course Builder (Multi-step)
│   ├── /courses/:courseId/students → Student Tracking
│   ├── /students                   → All Students
│   ├── /content-upload             → Upload Videos, PDFs, Assets
│   ├── /profile                    → Instructor Profile
│   └── /analytics                  → Performance Analytics
│
└── /admin/
    ├── /dashboard                  → Admin Overview (KPIs)
    ├── /users                      → User Management
    ├── /courses                    → Course Approval & Review
    ├── /courses/:courseId/review   → Detailed Course Review
    ├── /payments                   → Payment Management
    ├── /analytics                  → System Analytics
    ├── /settings/plans             → Manage Plans & Pricing
    ├── /settings/certificates      → Certificate Management
    └── /settings/general           → System Settings

```

---

## SECTION 2: COMPONENT STRUCTURE

### Core Reusable Components (`src/components/common/`)
```
common/
├── Card.jsx                 → Generic card container
├── Table.jsx                → Reusable data table with sorting/filtering
├── Modal.jsx                → Reusable modal dialog
├── Form.jsx                 → Form wrapper with validation
├── FormInput.jsx            → Text input with label & error
├── FormSelect.jsx           → Select dropdown
├── FormCheckbox.jsx         → Checkbox input
├── FormFileUpload.jsx       → File upload with preview
├── Button.jsx               → Button with variants (primary, secondary, danger)
├── Badge.jsx                → Status badge (success, warning, error, info)
├── LoadingSpinner.jsx       → Loading state indicator
├── EmptyState.jsx           → Empty state display with icon
├── ErrorBoundary.jsx        → Error boundary for error handling
└── Pagination.jsx           → Pagination controls
```

### Learner Dashboard Components (`src/components/student/`)
```
student/
├── UserProfileBlock.jsx         → Avatar, name, role, location, email, plan
├── CourseProgressSummary.jsx    → Completed, In-Progress, Not-Started counts + %
├── PaymentStatusCard.jsx        → Plan type, payment method, status, buttons
├── CourseCard.jsx               → Course card with progress, chapters, status badge
├── CoursesSection.jsx           → Courses list with filtering (All / In Progress / Completed)
├── RecommendedCourses.jsx       → Courses based on category/progress + enroll button
├── WeeklyScheduleWidget.jsx     → Upcoming lessons/tests with date, time, type
├── NotificationCenter.jsx       → Notification dropdown (course updates, payment, certs)
├── CertificatesSection.jsx      → Display certificates with download, verify, QR code
└── SubscriptionUpgradeModal.jsx → Plan comparison & upgrade flow
```

### Instructor Panel Components (`src/components/instructor/`)
```
instructor/
├── InstructorMetrics.jsx        → Total courses, students, revenue
├── CourseManagementTable.jsx    → List courses (create/edit/delete/publish)
├── StudentTrackingTable.jsx     → Enrolled students per course + progress
├── ContentUploadWidget.jsx      → Upload videos, PDFs, images with preview
├── QuizBuilder.jsx              → Create/Edit quiz questions
├── CoursePublishModal.jsx       → Pre-publish checklist & confirmation
├── StudentProgressChart.jsx     → Student engagement over time
└── InstructorAnalytics.jsx      → Course performance metrics
```

### Admin Panel Components (`src/components/admin/`)
```
admin/
├── AdminMetrics.jsx             → Total users, active users, revenue, engagement
├── UserManagementTable.jsx      → Manage learners & instructors (activate/suspend)
├── CourseApprovalSection.jsx    → List pending courses for approval/rejection
├── CourseReviewModal.jsx        → Detailed course review with approval buttons
├── PaymentManagementTable.jsx   → View transactions, statuses, manual approvals
├── PlanManagementPanel.jsx      → Create/Edit pricing tiers
├── CertificateTemplateManager.jsx → Manage certificate designs
├── AnalyticsCharts.jsx          → System-wide analytics dashboards
└── SystemSettingsForm.jsx       → Platform branding, APK settings, etc.
```

### Layout Components (`src/components/layout/`)
```
layout/
├── DashboardLayout.jsx          → Main layout with sidebar/navbar
├── Sidebar.jsx                  → Role-aware sidebar navigation
├── Navbar.jsx                   → Header with notifications, profile menu
├── AuthLayout.jsx               → Auth pages layout (login/register)
└── Container.jsx                → Max-width container wrapper
```

---

## SECTION 3: API ENDPOINT SPECIFICATIONS

### Authentication
```
POST   /api/auth/register           → Register user (email, password, name, role)
POST   /api/auth/login              → Login + return token & user
POST   /api/auth/logout             → Logout
POST   /api/auth/refresh            → Refresh token
GET    /api/auth/me                 → Get current user profile
PUT    /api/auth/profile            → Update profile (name, avatar, bio)
```

### User Management
```
GET    /api/users/profile           → Get current user profile
PUT    /api/users/profile           → Update profile
GET    /api/users/:id               → Get user by ID
PUT    /api/users/:id               → Update user (admin only)
DELETE /api/users/:id               → Delete user (admin only)
GET    /api/users                   → List users (admin - with pagination, filtering)
PATCH  /api/users/:id/suspend       → Suspend user (admin)
PATCH  /api/users/:id/activate      → Activate user (admin)
```

### Learner Dashboard
```
GET    /api/dashboard/student       → Get learner dashboard data (summary, stats, courses)
GET    /api/dashboard/student/profile           → Learner profile info
GET    /api/dashboard/student/progress          → Progress stats (completed, in-progress, not-started)
GET    /api/dashboard/student/certificates      → List earned certificates
GET    /api/dashboard/student/notifications     → Get notifications
GET    /api/dashboard/student/schedule          → Upcoming lessons/tests
GET    /api/dashboard/student/recommendations   → Recommended courses
GET    /api/dashboard/student/subscription      → Current subscription info
```

### Courses (Student View)
```
GET    /api/courses                 → List all courses (with pagination, filtering, sorting)
GET    /api/courses/:courseId       → Get course details
GET    /api/courses/:courseId/chapters → Get course chapters
GET    /api/courses/:courseId/chapters/:chapterId → Get chapter content
POST   /api/courses/:courseId/enroll → Enroll student in course
GET    /api/courses/enrolled        → Get enrolled courses
GET    /api/courses/recommended     → Get recommended courses based on category
```

### Instructor Dashboard
```
GET    /api/dashboard/instructor    → Get instructor dashboard (courses, students, revenue)
GET    /api/dashboard/instructor/metrics        → Instructor KPIs
GET    /api/dashboard/instructor/analytics      → Course performance analytics
GET    /api/dashboard/instructor/students       → List all students
POST   /api/dashboard/instructor/students/:studentId/message → Message student
```

### Course Management (Instructor)
```
POST   /api/courses                 → Create new course
GET    /api/courses/instructor      → Get my courses
GET    /api/courses/:courseId       → Get course details
PUT    /api/courses/:courseId       → Update course
DELETE /api/courses/:courseId       → Delete course
PATCH  /api/courses/:courseId/publish → Publish course
PATCH  /api/courses/:courseId/unpublish → Unpublish course
GET    /api/courses/:courseId/students → Get enrolled students (instructor)
GET    /api/courses/:courseId/progress → Get student progress in course
```

### Chapter & Content Management
```
POST   /api/courses/:courseId/chapters          → Create chapter
GET    /api/courses/:courseId/chapters          → List chapters
PUT    /api/courses/:courseId/chapters/:chapterId → Update chapter
DELETE /api/courses/:courseId/chapters/:chapterId → Delete chapter
POST   /api/courses/:courseId/chapters/:chapterId/lessons → Add lesson
POST   /api/courses/:courseId/chapters/:chapterId/upload → Upload video
```

### Exercises/Quiz
```
POST   /api/exercises               → Create exercise/quiz
GET    /api/exercises/:exerciseId   → Get exercise
PUT    /api/exercises/:exerciseId   → Update exercise
POST   /api/exercises/:exerciseId/submit → Submit answer
GET    /api/exercises/:exerciseId/results → Get results
POST   /api/exercises/:exerciseId/attempt → Create attempt
```

### Progress Tracking
```
GET    /api/progress/student        → Get student's overall progress
GET    /api/progress/student/:courseId → Get progress in course
GET    /api/progress/student/:courseId/:chapterId → Get progress in chapter
POST   /api/progress/student/:courseId -> Mark chapter as started/completed
GET    /api/progress/:studentId/:courseId → Get specific student progress (instructor)
```

### Payment & Subscription
```
GET    /api/payments/invoices       → Get user's invoices
GET    /api/payments/subscription   → Get current subscription
POST   /api/payments/subscribe      → Subscribe to plan
POST   /api/payments/upgrade        → Upgrade subscription
POST   /api/payments/cancel         → Cancel subscription
GET    /api/payments/available-plans → List available plans
```

### Admin - User Management
```
GET    /api/admin/users             → List all users (with filters)
GET    /api/admin/users/:id         → Get user details
PUT    /api/admin/users/:id         → Modify user
DELETE /api/admin/users/:id         → Delete user
PATCH  /api/admin/users/:id/suspend → Suspend user
PATCH  /api/admin/users/:id/activate → Activate user
```

### Admin - Course Approval
```
GET    /api/admin/courses/pending   → List pending courses
POST   /api/admin/courses/:courseId/approve → Approve course
POST   /api/admin/courses/:courseId/reject → Reject course
GET    /api/admin/courses/:courseId/details → Detailed course review
```

### Admin - Payments
```
GET    /api/admin/payments/transactions → List all transactions
GET    /api/admin/payments/revenue -> Revenue analytics
POST   /api/admin/payments/:invoiceId/approve → Manual approval
GET    /api/admin/payments/coupons → Manage coupons
```

### Admin - Settings
```
GET    /api/admin/settings/plans           → Get all pricing plans
POST   /api/admin/settings/plans           → Create plan
PUT    /api/admin/settings/plans/:planId   → Update plan
DELETE /api/admin/settings/plans/:planId   → Delete plan
GET    /api/admin/settings/certificates   → Get certificate templates
POST   /api/admin/settings/certificates   → Create template
PUT    /api/admin/settings/general        → Update system settings
```

### Admin - Analytics
```
GET    /api/admin/analytics/dashboard      → System-wide KPIs
GET    /api/admin/analytics/users          → User growth over time
GET    /api/admin/analytics/courses        → Course engagement
GET    /api/admin/analytics/revenue        → Revenue trends
```

### File Upload
```
POST   /api/upload/avatar            → Upload user avatar
POST   /api/upload/thumbnail         → Upload course thumbnail
POST   /api/upload/video             → Upload video (large file)
POST   /api/upload/document          → Upload PDF/document
POST   /api/upload/certificate       → Upload certificate template
```

---

## SECTION 4: DATA MODELS

### User Model
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "password_hash": "hashed_password",
  "role": "learner|instructor|admin",
  "avatar_url": "https://...",
  "bio": "User bio",
  "location": "Rwanda",
  "phone": "+250...",
  "plan": "free|premium|academia",
  "subscription_status": "active|inactive|cancelled",
  "subscription_expires_at": "2026-08-15T00:00:00Z",
  "is_active": true,
  "is_suspended": false,
  "created_at": "2026-01-15T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Course Model
```json
{
  "id": "uuid",
  "title": "Advanced React Patterns",
  "subtitle": "Master React with advanced patterns",
  "description": "Full course description",
  "instructor_id": "uuid",
  "category": "programming|business|design",
  "level": "beginner|intermediate|advanced",
  "thumbnail_url": "https://...",
  "status": "draft|published|approved|rejected",
  "approval_status": "pending|approved|rejected",
  "price": 50.00,
  "subscription_price": 5.00,
  "duration_weeks": 8,
  "required_hours_per_week": 5,
  "total_chapters": 10,
  "total_lessons": 45,
  "total_students": 150,
  "average_rating": 4.8,
  "review_count": 45,
  "language": "English",
  "objectives": ["Learn patterns", "Build apps"],
  "target_audience": "Developers",
  "published_at": "2026-02-01T00:00:00Z",
  "created_at": "2026-01-15T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Enrollment Model
```json
{
  "id": "uuid",
  "student_id": "uuid",
  "course_id": "uuid",
  "status": "active|completed|suspended|cancelled",
  "progress_percentage": 45,
  "chapters_completed": 4,
  "lessons_completed": 20,
  "quiz_score": 85.5,
  "last_accessed_at": "2026-04-15T10:30:00Z",
  "enrolled_at": "2026-02-01T00:00:00Z",
  "completed_at": null,
  "created_at": "2026-02-01T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Chapter Model
```json
{
  "id": "uuid",
  "course_id": "uuid",
  "title": "Getting Started",
  "description": "Introduction to the course",
  "order": 1,
  "total_lessons": 5,
  "estimated_hours": 2,
  "is_locked": false,
  "materials": [
    {
      "id": "uuid",
      "type": "video|pdf|article",
      "title": "Introduction Video",
      "url": "https://...",
      "duration": 15,
      "order": 1
    }
  ],
  "created_at": "2026-01-15T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Progress Model
```json
{
  "id": "uuid",
  "student_id": "uuid",
  "course_id": "uuid",
  "chapter_id": "uuid",
  "status": "not_started|in_progress|completed",
  "progress_percentage": 60,
  "lessons_completed": 3,
  "quiz_score": 85.5,
  "last_accessed_at": "2026-04-15T10:30:00Z",
  "started_at": "2026-02-01T00:00:00Z",
  "completed_at": null,
  "created_at": "2026-02-01T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Certificate Model
```json
{
  "id": "uuid",
  "student_id": "uuid",
  "course_id": "uuid",
  "certificate_number": "CERT-2026-001234",
  "template_id": "uuid",
  "pdf_url": "https://...",
  "qr_code": "https://...",
  "issued_at": "2026-04-15T00:00:00Z",
  "expires_at": null,
  "is_verified": true,
  "created_at": "2026-04-15T00:00:00Z"
}
```

### Payment/Invoice Model
```json
{
  "id": "uuid",
  "student_id": "uuid",
  "amount": 50.00,
  "currency": "RWF",
  "payment_method": "credit_card|mobile_money|paypal",
  "status": "pending|completed|failed|refunded",
  "type": "course_purchase|subscription|upgrade",
  "course_id": "uuid|null",
  "plan_id": "uuid|null",
  "transaction_id": "external_txn_id",
  "receipt_url": "https://...",
  "paid_at": "2026-04-15T00:00:00Z",
  "created_at": "2026-04-15T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Subscription Plan Model
```json
{
  "id": "uuid",
  "name": "Academia Pro",
  "description": "Professional plan",
  "price": 9.99,
  "currency": "USD",
  "billing_period": "monthly|yearly",
  "features": [
    "Unlimited courses",
    "Priority support",
    "Certificate generation"
  ],
  "max_courses": -1,
  "max_downloads": -1,
  "is_active": true,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-04-15T00:00:00Z"
}
```

### Notification Model
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "course_update|payment|certificate|announcement",
  "title": "Course Updated",
  "message": "New chapter added to Advanced React",
  "related_id": "course_id|payment_id",
  "is_read": false,
  "created_at": "2026-04-15T09:30:00Z"
}
```

---

## SECTION 5: STATE MANAGEMENT

### Recommended: Zustand (Lightweight) OR Redux Toolkit (Enterprise)

#### Option A: Zustand (Simpler, Recommended for this project)
```javascript
// stores/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
    logout: () => set({ user: null, token: null, isAuthenticated: false }),
  }), {
    name: 'auth-storage',
  })
);

// stores/useCoursesStore.js
export const useCoursesStore = create((set) => ({
  courses: [],
  filters: { status: 'all', search: '' },
  setCourses: (courses) => set({ courses }),
  setFilters: (filters) => set({ filters }),
}));

// stores/useDashboardStore.js
export const useDashboardStore = create((set) => ({
  dashboardData: null,
  loading: false,
  setDashboardData: (data) => set({ dashboardData: data, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
```

#### Option B: Redux Toolkit
```javascript
// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// store/slices/coursesSlice.js
export const coursesSlice = createSlice({
  name: 'courses',
  initialState: { courses: [], filters: {}, pagination: {} },
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    // ...
  },
});
```

---

## SECTION 6: MISSING UI COMPONENTS TO ADD

### Learner Dashboard
- [ ] User Profile Block component
- [ ] Course Progress Summary card
- [ ] Payment Status widget
- [ ] Course Card (with progress, chapters, status badge)
- [ ] Courses Filtering (All/In Progress/Completed tabs)
- [ ] Recommended Courses section
- [ ] Weekly Schedule widget
- [ ] Notification Center dropdown
- [ ] Certificates section with download
- [ ] Subscription upgrade modal

### Instructor Panel
- [ ] Instructor Metrics dashboard
- [ ] Course Management table (CRUD)
- [ ] Student Tracking table
- [ ] Content Upload widget
- [ ] Quiz Builder
- [ ] Course Publish Modal
- [ ] Performance Analytics
- [ ] Student Progress Charts

### Admin Panel
- [ ] Admin KPI Metrics
- [ ] User Management table
- [ ] Course Approval section
- [ ] Payment Management table
- [ ] Plan Management form
- [ ] Certificate Template Manager
- [ ] System Settings form
- [ ] Analytics Dashboard

---

## SECTION 7: COMPONENT USAGE PATTERNS

### Pattern: Loading/Empty/Error States
Every component that fetches data should follow this pattern:

```javascript
export const MyComponent = () => {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) return <EmptyState title="No data" />;

  return (
    // Render data
  );
};
```

### Pattern: Role-Based Rendering
```javascript
import { useAuth } from '../contexts/AuthContext';

export const RoleBasedComponent = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminView />;
  if (user?.role === 'instructor') return <InstructorView />;
  return <LearnerView />;
};
```

### Pattern: Reusable Form Component
```javascript
<Form onSubmit={handleSubmit}>
  <FormInput name="title" label="Title" required />
  <FormSelect name="category" label="Category" options={categories} />
  <FormFileUpload name="thumbnail" label="Upload Thumbnail" accept="image/*" />
  <Button type="submit">Save</Button>
</Form>
```

---

## SECTION 8: FILE STRUCTURE

```
frontend/src/
├── api/
│   ├── client.js                  # Axios instance
│   ├── apiService.js              # API functions (deprecated - replace with hooks)
│   └── endpoints.js               # API endpoint constants
├── components/
│   ├── common/                    # Core reusable components
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── Form.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── EmptyState.jsx
│   │   └── Badge.jsx
│   ├── layout/
│   │   ├── DashboardLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── Container.jsx
│   ├── student/                   # Learner Dashboard components
│   │   ├── UserProfileBlock.jsx
│   │   ├── CourseProgressSummary.jsx
│   │   ├── PaymentStatusCard.jsx
│   │   ├── CourseCard.jsx
│   │   ├── CoursesSection.jsx
│   │   ├── RecommendedCourses.jsx
│   │   ├── WeeklyScheduleWidget.jsx
│   │   ├── NotificationCenter.jsx
│   │   └── CertificatesSection.jsx
│   ├── instructor/                # Instructor Panel
│   │   ├── InstructorMetrics.jsx
│   │   ├── CourseManagementTable.jsx
│   │   ├── StudentTrackingTable.jsx
│   │   └── ContentUploadWidget.jsx
│   └── admin/                     # Admin Panel
│       ├── AdminMetrics.jsx
│       ├── UserManagementTable.jsx
│       ├── CourseApprovalSection.jsx
│       └── PaymentManagementTable.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx    # Global notifications (NEW)
├── hooks/
│   ├── useApi.js                  # Query hooks
│   ├── usePagination.js           # Pagination logic (NEW)
│   └── useRoleCheck.js            # Role validation (NEW)
├── pages/
│   ├── auth/
│   ├── student/
│   ├── instructor/
│   └── admin/
├── stores/                        # Zustand stores (NEW)
│   ├── useAuthStore.js
│   ├── useCoursesStore.js
│   └── useDashboardStore.js
├── utils/
│   ├── helpers.js
│   ├── response.js
│   ├── formatters.js              # Date, currency formatting (NEW)
│   ├── validators.js              # Form validation (NEW)
│   └── constants.js               # App constants (NEW)
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## SECTION 9: IMPLEMENTATION PRIORITY

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create common UI components (Card, Button, Form, etc.)
- [ ] Create Zustand stores
- [ ] Add missing API hooks
- [ ] Create LoadingSpinner, EmptyState components

### Phase 2: Learner Dashboard (Week 2)
- [ ] User Profile Block
- [ ] Course Progress Summary
- [ ] Payment Status Card
- [ ] Course Cards with filtering
- [ ] Notification Center

### Phase 3: Instructor Panel (Week 3)
- [ ] Instructor Dashboard overview
- [ ] Course Management Table
- [ ] Student Tracking
- [ ] Content Upload Widget

### Phase 4: Admin Panel (Week 4)
- [ ] Admin Dashboard
- [ ] User Management Table
- [ ] Course Approval System
- [ ] Payment Management

### Phase 5: Polish & Integration (Week 5)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Error handling & edge cases
- [ ] Backend integration adjustments

---

## SECTION 10: KEY INTEGRATION POINTS

### Expected Backend Changes
1. **Dashboard endpoints** must return normalized data structures
2. **Role-based fields** should be included in user responses
3. **Notification system** should have dedicated endpoints
4. **Pagination** should use standard format (page, limit, total)
5. **Error responses** should follow consistent format: `{success: false, message: "...", errors: {}}`

### Frontend Assumptions
1. All dates are ISO 8601 format (UTC)
2. All IDs are UUIDs
3. All money is in decimal format (50.00, not 5000 cents)
4. All file uploads accept multipart/form-data
5. Authentication uses Bearer tokens in Authorization header

