import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProfileSettings } from './pages/student/ProfileSettings';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentProjectsPage } from './pages/student/StudentProjectsPage';
import { StudentProgressPage } from './pages/student/StudentProgressPage';
import { StudentCourseDetailsPage } from './pages/student/StudentCourseDetailsPage';
import { CourseDetailsPage } from './pages/student/CourseDetailsPage';
import { PaymentInvoicesPage } from './pages/student/PaymentInvoicesPage';

// Instructor Pages
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { InstructorCoursesPage } from './pages/instructor/InstructorCoursesPage';
import { InstructorStudentsPage } from './pages/instructor/InstructorStudentsPage';
import { InstructorCourseDetailsPage } from './pages/instructor/InstructorCourseDetailsPage';
import { CourseChaptersPage } from './pages/instructor/CourseChaptersPage';
import { CourseBuilderPage } from './pages/instructor/CourseBuilderPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCourseDetailsPage } from './pages/admin/AdminCourseDetailsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminEnrollmentsPage } from './pages/admin/AdminEnrollmentsPage';
import { AdminExercisesPage } from './pages/admin/AdminExercisesPage';
import { AdminExerciseAttemptsPage } from './pages/admin/AdminExerciseAttemptsPage';
import { AdminInvoicesPage } from './pages/admin/AdminInvoicesPage';
import { AdminSyllabusesPage } from './pages/admin/AdminSyllabusesPage';
import { AdminSyllabusOutlinesPage } from './pages/admin/AdminSyllabusOutlinesPage';
import { AdminUserProgressPage } from './pages/admin/AdminUserProgressPage';

import './App.css';

const queryClient = new QueryClient();

// Root redirect component that handles intelligent routing
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user?.role === 'instructor') {
    return <Navigate to="/instructor/dashboard" replace />;
  }
  // Default to student
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Root route - intelligent redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Shared Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/projects"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses/:courseId"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentCourseDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/progress"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProgressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/payments"
              element={
                <ProtectedRoute requiredRole="student">
                  <PaymentInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute requiredRole="student">
                  <CourseDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/course-details/:courseId"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorCourseDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/students"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <InstructorStudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:courseId/chapters"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CourseChaptersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/create-course"
              element={
                <ProtectedRoute requiredRole="instructor">
                  <CourseBuilderPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/course-details/:courseId"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminCourseDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReviewsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enrollments"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminEnrollmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exercises"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminExercisesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exercise-attempts"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminExerciseAttemptsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoices"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/syllabuses"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSyllabusesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/syllabus-outlines"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSyllabusOutlinesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user-progress"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserProgressPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all for 404 - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
