# Frontend-Backend Integration Guide

## Quick Start

### 1. Install Required Dependencies

```bash
cd frontend
npm install zustand@latest
npm install prop-types
```

### 2. Update Your `package.json`

Make sure you have these dependencies:

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "axios": "^1.x"
  }
}
```

### 3. File Structure Overview

Your new file structure should look like:

```
frontend/src/
├── components/
│   ├── common/              ← Core reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── Form.jsx
│   │   ├── Badge.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   └── Pagination.jsx
│   ├── student/             ← Learner dashboard components
│   │   ├── UserProfileBlock.jsx
│   │   ├── CourseProgressSummary.jsx
│   │   ├── PaymentStatusCard.jsx
│   │   ├── CourseCard.jsx
│   │   ├── CoursesSection.jsx
│   │   ├── NotificationCenter.jsx
│   │   ├── CertificatesSection.jsx
│   │   └── RecommendedCourses.jsx
│   ├── instructor/          ← Instructor panel components
│   │   ├── InstructorMetrics.jsx
│   │   ├── CourseManagementTable.jsx
│   │   ├── StudentTrackingTable.jsx
│   │   └── ContentUploadWidget.jsx
│   └── admin/               ← Admin panel components
│       ├── AdminMetrics.jsx
│       ├── UserManagementTable.jsx
│       ├── CourseApprovalSection.jsx
│       └── PaymentManagementTable.jsx
├── stores/                  ← Zustand state stores
│   ├── useAuthStore.js
│   ├── useCoursesStore.js
│   ├── useDashboardStore.js
│   └── useNotificationsStore.js
├── utils/
│   ├── formatters.js        ← Date, currency formatting
│   ├── validators.js        ← Form validation
│   └── constants.js         ← App constants
└── ...
```

---

## Integration Steps

### Step 1: Update Your StudentDashboard Page

Replace or enhance your existing `src/pages/student/StudentDashboard.jsx`:

```jsx
import { UserProfileBlock } from '../../components/student/UserProfileBlock';
import { CourseProgressSummary } from '../../components/student/CourseProgressSummary';
import { PaymentStatusCard } from '../../components/student/PaymentStatusCard';
import { CoursesSection } from '../../components/student/CoursesSection';
import { NotificationCenter } from '../../components/student/NotificationCenter';
import { CertificatesSection } from '../../components/student/CertificatesSection';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useStudentDashboard, useStudentNotifications } from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, error } = useStudentDashboard();
  const { data: notificationsData } = useStudentNotifications();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error.message} />;

  const dashboard = dashboardData?.data || {};
  const notifications = notificationsData?.data || [];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-white">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your learning progress.</p>
          </div>
          <NotificationCenter
            notifications={notifications}
            unreadCount={notifications.filter(n => !n.is_read).length}
          />
        </div>

        {/* Profile Block */}
        <div className="mb-8">
          <UserProfileBlock
            user={dashboard.user}
            onEditClick={() => navigate('/student/profile')}
          />
        </div>

        {/* Progress Summary */}
        <div className="mb-8">
          <CourseProgressSummary stats={dashboard.progressStats} />
        </div>

        {/* Subscription Status */}
        {dashboard.subscription && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CoursesSection
                courses={dashboard.courses}
                onCourseClick={(courseId) => navigate(`/student/courses/${courseId}`)}
              />
            </div>
            <div>
              <PaymentStatusCard
                subscription={dashboard.subscription}
                onUpgradeClick={() => navigate('/student/payment-invoices')}
              />
            </div>
          </div>
        )}

        {/* Certificates */}
        {dashboard.certificates && dashboard.certificates.length > 0 && (
          <div className="mb-8">
            <CertificatesSection
              certificates={dashboard.certificates}
              onDownloadClick={(certId) => {
                // Trigger download API
                window.open(`/api/certificates/${certId}/download`, '_blank');
              }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
```

### Step 2: Create Instructor Dashboard Page

Create `src/pages/instructor/EnhancedInstructorDashboard.jsx`:

```jsx
import { InstructorMetrics } from '../../components/instructor/InstructorMetrics';
import { CourseManagementTable } from '../../components/instructor/CourseManagementTable';
import { StudentTrackingTable } from '../../components/instructor/StudentTrackingTable';
import { ContentUploadWidget } from '../../components/instructor/ContentUploadWidget';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useInstructorDashboard, useInstructorCourses } from '../../hooks/useApi';

export const EnhancedInstructorDashboard = () => {
  const { data: dashboardData, isLoading } = useInstructorDashboard();
  const { data: coursesData } = useInstructorCourses();

  if (isLoading) return <LoadingSpinner fullScreen />;

  const dashboard = dashboardData?.data || {};
  const courses = coursesData?.data || [];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Instructor Dashboard</h1>

        {/* Metrics */}
        <InstructorMetrics metrics={dashboard.metrics} />

        {/* Course Management */}
        <div className="mb-8">
          <CourseManagementTable
            courses={courses}
            onCreateClick={() => navigate('/instructor/courses/new')}
            onEditClick={(course) => navigate(`/instructor/courses/${course.id}/edit`)}
          />
        </div>

        {/* Content Upload */}
        <div className="mb-8">
          <ContentUploadWidget />
        </div>
      </div>
    </DashboardLayout>
  );
};
```

### Step 3: Create Admin Dashboard Page

Create `src/pages/admin/EnhancedAdminDashboard.jsx`:

```jsx
import { AdminMetrics } from '../../components/admin/AdminMetrics';
import { UserManagementTable } from '../../components/admin/UserManagementTable';
import { CourseApprovalSection } from '../../components/admin/CourseApprovalSection';
import { PaymentManagementTable } from '../../components/admin/PaymentManagementTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAdminDashboard, useAdminUsers, usePendingCourses } from '../../hooks/useApi';

export const EnhancedAdminDashboard = () => {
  const { data: dashboardData, isLoading } = useAdminDashboard();
  const { data: usersData } = useAdminUsers();
  const { data: coursesData } = usePendingCourses();

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        {/* Metrics */}
        <AdminMetrics metrics={dashboardData?.metrics} />

        {/* Users */}
        <UserManagementTable users={usersData?.data} />

        {/* Course Approval */}
        <CourseApprovalSection courses={coursesData?.data} />

        {/* Payments */}
        <PaymentManagementTable payments={dashboardData?.payments} />
      </div>
    </DashboardLayout>
  );
};
```

### Step 4: Add Extended API Hooks

Replace or update your `src/hooks/useApi.js` with the hooks from `EXTENDED_API_HOOKS.md`.

### Step 5: Create Zustand Stores

Add the store files from `src/stores/`:
- `useAuthStore.js`
- `useCoursesStore.js`
- `useDashboardStore.js`
- `useNotificationsStore.js`

### Step 6: Add Utility Files

Create the utility files in `src/utils/`:
- `formatters.js`
- `validators.js`
- `constants.js`

---

## Backend API Expectations

### Required Response Format

All API responses should follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Your data here
  },
  "errors": {}
}
```

### Example: Student Dashboard Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar_url": "https://...",
      "role": "learner",
      "plan": "premium"
    },
    "progressStats": {
      "completedCourses": 3,
      "inProgressCourses": 2,
      "notStartedCourses": 1,
      "progressPercentage": 75
    },
    "courses": [
      {
        "id": "uuid",
        "title": "Advanced React",
        "instructor_name": "Jane Smith",
        "thumbnail_url": "https://...",
        "total_chapters": 10,
        "lessons_completed": 8,
        "progress_percentage": 80,
        "status": "in_progress",
        "quiz_score": 85
      }
    ],
    "subscription": {
      "planName": "Premium Plan",
      "paymentMethod": "Credit Card",
      "status": "active",
      "expiresAt": "2026-12-31"
    },
    "certificates": [
      {
        "id": "uuid",
        "course_name": "JavaScript Basics",
        "certificate_number": "CERT-2026-001",
        "issued_at": "2026-03-15",
        "qr_code": "https://...",
        "is_verified": true
      }
    ],
    "notifications": []
  }
}
```

---

## Component Usage Examples

### Using CourseCard Component

```jsx
<CourseCard
  course={courseData}
  progress={45}
  status="in_progress"
  onViewClick={() => navigate(`/courses/${courseData.id}`)}
  onContinueClick={() => navigate(`/courses/${courseData.id}/content`)}
/>
```

### Using Table Component

```jsx
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (value) => <Badge label={value} /> },
  ]}
  data={studentsList}
  isLoading={isLoading}
  sortable={true}
  pagination={{ page: 1, totalPages: 5, total: 50 }}
  onPageChange={(page) => setPage(page)}
/>
```

### Using Form Components

```jsx
<FormInput
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
/>

<FormSelect
  label="Category"
  name="category"
  options={CATEGORIES}
  value={formData.category}
  onChange={handleChange}
/>

<FormCheckbox
  label="Newsletter"
  name="newsletter"
  checked={formData.newsletter}
  onChange={handleChange}
/>
```

---

## Common Integration Patterns

### Pattern 1: Loading/Error/Empty States

```jsx
import { LoadingSpinner, EmptyState, ErrorState } from '../components/common';

const MyComponent = () => {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.length) return <EmptyState title="No data" />;

  return <div>{/* Your content */}</div>;
};
```

### Pattern 2: Role-Based Rendering

```jsx
import { useAuth } from '../contexts/AuthContext';

const RoleBasedComponent = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminView />;
  if (user?.role === 'instructor') return <InstructorView />;
  return <StudentView />;
};
```

### Pattern 3: Mutation with Success Handling

```jsx
const { mutate: createCourse, isLoading } = useCreateCourse();

const handleSubmit = (formData) => {
  createCourse(formData, {
    onSuccess: (response) => {
      toast.success('Course created!');
      navigate(`/instructor/courses/${response.data.id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message);
    },
  });
};
```

---

## Styling Notes

All components use **Tailwind CSS** classes. Make sure your `tailwind.config.js` is properly configured:

```js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## Testing Integration

### Test a Simple Component

```jsx
import { render, screen } from '@testing-library/react';
import { CourseCard } from '../components/student/CourseCard';

test('renders course card', () => {
  render(
    <CourseCard
      course={{ id: '1', title: 'Test Course', instructor_name: 'John' }}
      progress={50}
      status="in_progress"
    />
  );
  expect(screen.getByText('Test Course')).toBeInTheDocument();
});
```

---

## Next Steps

1. **Copy all components** from this package into your `src/components/` directory
2. **Install Zustand**: `npm install zustand`
3. **Create stores** in `src/stores/`
4. **Create utilities** in `src/utils/`
5. **Update your dashboard pages** to use the new components
6. **Verify API endpoints** match the expected format
7. **Test each component** in isolation first
8. **Integrate with existing pages** gradually

---

## Troubleshooting

### Components not rendering?
- Check that all imports are correct
- Ensure Tailwind CSS is configured
- Verify all required props are passed

### API calls failing?
- Check API endpoint URLs in `api/endpoints.js`
- Verify response format matches expectations
- Check network tab in browser DevTools

### Styles not applied?
- Rebuild Tailwind: `npm run build:css`
- Clear browser cache
- Check `tailwind.config.js` includes your component files

---

## Support & Questions

Refer to:
- **ARCHITECTURE_GUIDE.md** - Full architectural overview
- **Component JSX files** - Inline comments and PropTypes
- **Backend docs** - Expected API endpoint responses

