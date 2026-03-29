import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useCreateCourse, usePublishCourse, useUpdateCourse } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import { CourseFormModal } from '../../components/modals/CourseFormModal';

export const InstructorCoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: coursesData, isLoading, refetch } = useCourses();
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  // Filter courses by current instructor
  const instructorCourses = coursesData?.data?.filter(
    c => c.instructor_id === user?.id
  ) || [];

  const handleCreateCourse = (formData) => {
    createCourse(formData, {
      onSuccess: () => {
        setShowForm(false);
        refetch();
      },
    });
  };

  const handleUpdateCourse = (formData) => {
    updateCourse(
      { courseId: editingCourse.id, courseData: formData },
      {
        onSuccess: () => {
          setShowForm(false);
          setEditingCourse(null);
          refetch();
        },
      }
    );
  };

  const handlePublishCourse = (courseId) => {
    publishCourse(
      { courseId, data: {} },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleManageChapters = (course) => {
    navigate(`/instructor/courses/${course.id}/chapters`, { state: { course } });
  };

  const handleViewCourseDetails = (course) => {
    navigate(`/instructor/course-details/${course.id}`);
  };

  const handleViewCourse = (course) => {
    navigate(`/course/${course.id}`);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
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

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 My Courses</h1>
            <p className="text-gray-600">Manage and create your courses</p>
          </div>
          <button
            onClick={() => {
              setEditingCourse(null);
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Create Course
          </button>
        </div>

        {/* Courses Table */}
        {instructorCourses.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Chapters</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {instructorCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.category || 'Uncategorized'}
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
                        {course.chapters?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewCourseDetails(course)}
                            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                            title="View details"
                          >
                            📊 Details
                          </button>
                          <button
                            onClick={() => handleManageChapters(course)}
                            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                            title="Manage chapters"
                          >
                            📚 Chapters
                          </button>
                          <button
                            onClick={() => handleViewCourse(course)}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            title="View course"
                          >
                            👁️ View
                          </button>
                          {course.status !== 'published' && (
                            <button
                              onClick={() => handlePublishCourse(course.id)}
                              disabled={isPublishing}
                              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                              title="Publish course"
                            >
                              ✓ Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            title="Edit course"
                          >
                            ✏️ Edit
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
            <p className="text-gray-600 text-lg mb-4">No courses yet. Create your first course!</p>
            <button
              onClick={() => {
                setEditingCourse(null);
                setShowForm(true);
              }}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Course
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-blue-600">{instructorCourses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Published</p>
            <p className="text-3xl font-bold text-green-600">
              {instructorCourses.filter(c => c.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Draft</p>
            <p className="text-3xl font-bold text-yellow-600">
              {instructorCourses.filter(c => c.status === 'draft' || !c.status).length}
            </p>
          </div>
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <CourseFormModal
          course={editingCourse}
          onClose={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
          onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
          isLoading={editingCourse ? isUpdating : isCreating}
        />
      )}
    </DashboardLayout>
  );
};
