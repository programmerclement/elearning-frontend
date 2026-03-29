import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useDeleteCourse } from '../../hooks/useApi';

export const AdminCoursesPage = () => {
  const { data, isLoading, error, refetch } = useCourses();
  const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const courses = data?.data || [];
  
  const filteredCourses = statusFilter === 'all' 
    ? courses 
    : courses.filter(c => c.status === statusFilter);

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteCourse(courseId, {
        onSuccess: () => {
          setCourseToDelete(null);
          refetch();
        },
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error loading courses: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Manage All Courses</h1>
          <p className="text-gray-600">Review and manage all courses in the system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {courses.filter(c => c.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Draft</p>
            <p className="text-3xl font-bold text-yellow-600">
              {courses.filter(c => !c.status || c.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Archived</p>
            <p className="text-3xl font-bold text-gray-600">
              {courses.filter(c => c.status === 'archived').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'published'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === 'draft'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Draft
          </button>
        </div>

        {/* Courses Table */}
        {filteredCourses.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Instructor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Chapters</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.instructor_name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${(Number(course.price) || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : course.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {course.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                        {(course.chapters || []).length}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => window.open(`/admin/course-details/${course.id}`, '_blank')}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            title="View course"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={isDeleting}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                            title="Delete course"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No courses found with the selected filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
