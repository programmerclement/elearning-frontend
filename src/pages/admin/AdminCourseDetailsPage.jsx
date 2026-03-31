import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourse } from '../../hooks/useApi';

export const AdminCourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useCourse(courseId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.data) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <button
            onClick={() => navigate('/admin/courses')}
            className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
          >
            ← Back to Courses
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading course: {error?.message || 'Course not found'}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const course = data.data;

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <button
          onClick={() => navigate('/admin/courses')}
          className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
        >
          ← Back to Courses
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Course Header with Thumbnail */}
          <div className="h-80 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl">📘</span>
            )}
          </div>

          {/* Course Details */}
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{course.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  course.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : course.status === 'archived'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status?.toUpperCase() || 'DRAFT'}
                </span>
                {course.rating && (
                  <span className="text-lg font-semibold text-yellow-600">
                    ⭐ {course.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg">{course.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Price</p>
                <p className="text-2xl font-bold text-blue-600">{(Number(course.price) || 0).toFixed(2)} RWF</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Instructor</p>
                <p className="text-lg font-semibold text-green-700">{course.instructor_name || 'Unknown'}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Chapters</p>
                <p className="text-2xl font-bold text-purple-600">{(course.chapters || []).length}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm mb-1">Students</p>
                <p className="text-2xl font-bold text-orange-600">{course.enrolled_count || 0}</p>
              </div>
            </div>

            {/* Chapters Section */}
            {course.chapters && course.chapters.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Chapters</h2>
                <div className="space-y-3">
                  {course.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            {chapter.exercises && (
                              <span>📋 {chapter.exercises.length} exercises</span>
                            )}
                            {chapter.duration && (
                              <span>⏱️ {chapter.duration} mins</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Meta*/}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div>
                <p className="text-gray-600 text-sm">Created</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(course.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Updated</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(course.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Duration</p>
                <p className="text-gray-800 font-semibold">
                  {course.total_duration || (course.chapters?.length || 0) + ' chapters'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
