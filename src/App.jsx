import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentCoursesPage } from './pages/student/StudentCoursesPage';
import { StudentProgressPage } from './pages/student/StudentProgressPage';
import { StudentCourseDetailsPage } from './pages/student/StudentCourseDetailsPage';
import { CourseDetailsPage } from './pages/student/CourseDetailsPage';

// Instructor Pages
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { InstructorCoursesPage } from './pages/instructor/InstructorCoursesPage';
import { InstructorStudentsPage } from './pages/instructor/InstructorStudentsPage';
import { InstructorCourseDetailsPage } from './pages/instructor/InstructorCourseDetailsPage';
import { CourseChaptersPage } from './pages/instructor/CourseChaptersPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';
import { AdminCourseDetailsPage } from './pages/admin/AdminCourseDetailsPage';

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
              path="/admin/activity"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminActivityPage />
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
