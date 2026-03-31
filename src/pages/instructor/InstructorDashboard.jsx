import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useInstructorDashboard, useCourses } from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, error } = useInstructorDashboard();
  const { data: coursesData } = useCourses();
  const [activeTab, setActiveTab] = useState('overview');

  // Filter courses by current instructor
  const instructorCourses = coursesData?.data?.filter(
    c => c.instructor_id === user?.id
  ) || [];

  const handleViewCourseDetails = (courseId) => {
    navigate(`/instructor/course-details/${courseId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your courses and track your performance.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading dashboard</p>
            <p>{error.message}</p>
          </div>
        ) : data ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-blue-600">{data?.data?.totalCourses || 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-green-600">{data?.data?.totalStudents || 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Total Enrollments</p>
                <p className="text-3xl font-bold text-purple-600">{data?.data?.totalEnrollments || 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Avg Rating</p>
                <p className="text-3xl font-bold text-orange-600">
                  {parseFloat(data?.data?.averageRating || 0).toFixed(1)} ⭐
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-2 font-semibold transition-colors ${
                  activeTab === 'courses'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                📚 My Courses ({instructorCourses.length})
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Course Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Published Courses</span>
                      <span className="text-lg font-bold text-green-600">
                        {instructorCourses.filter(c => c.status === 'published').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Draft Courses</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {instructorCourses.filter(c => !c.status || c.status === 'draft').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg Course Price</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${
                          instructorCourses.length > 0
                            ? (
                                instructorCourses.reduce((sum, c) => sum + (Number(c.price) || 0), 0) /
                                instructorCourses.length
                              ).toFixed(2)
                            : 0
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <button
                    onClick={() => navigate('/instructor/courses')}
                    className="w-full bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition mb-3"
                  >
                    📚 Manage Courses
                  </button>
                  <button
                    onClick={() => navigate('/instructor/students')}
                    className="w-full bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition mb-3"
                  >
                    👥 View Students
                  </button>
                  <button
                    onClick={() => instructorCourses.length > 0 && navigate(`/instructor/course-details/${instructorCourses[0].id}?tab=syllabus`)}
                    disabled={instructorCourses.length === 0}
                    className="w-full bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📚 Manage Syllabuses
                  </button>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                {instructorCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructorCourses.map((course) => (
                      <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition border border-gray-200">
                        <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">📘</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                          
                          <div className="space-y-2 mb-4 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price:</span>
                              <span className="font-bold text-blue-600">{(Number(course.price) || 0).toFixed(2)} RWF</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className={`font-bold ${
                                course.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                                {course.status?.toUpperCase() || 'DRAFT'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Chapters:</span>
                              <span className="font-bold">{(course.chapters || []).length}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewCourseDetails(course.id)}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-3 rounded transition hover:bg-blue-700"
                          >
                            📊 View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600 text-lg mb-4">No courses yet</p>
                    <button
                      onClick={() => navigate('/instructor/courses')}
                      className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Create Your First Course
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No data available
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
