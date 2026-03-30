import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useCourseEnrollments } from '../../hooks/useApi';

export const AdminEnrollmentsPage = () => {
  const { data: coursesData } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { data: enrollmentsData, refetch: refetchEnrollments } = useCourseEnrollments(selectedCourseId);

  const courses = coursesData?.data || [];
  const enrollments = enrollmentsData && Array.isArray(enrollmentsData) ? enrollmentsData : enrollmentsData?.data || [];

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Enrollments</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Enrollments</p>
            <p className="text-3xl font-bold text-blue-600">{enrollments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-green-600">{courses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Average per Course</p>
            <p className="text-3xl font-bold text-purple-600">
              {courses.length > 0 ? Math.round(enrollments.length / courses.length) : 0}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {enrollments.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No enrollments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Enrolled Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{enrollment.course_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{enrollment.student_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{enrollment.student_email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(enrollment.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
