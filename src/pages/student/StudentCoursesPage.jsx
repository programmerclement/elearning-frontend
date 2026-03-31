import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useStudentDashboard, useCourseSyllabuses, useAllCoursesProgress, useCourseReviews } from '../../hooks/useApi';
import { EnrollmentModal } from '../../components/modals/EnrollmentModal';

export const StudentCoursesPage = () => {
  const navigate = useNavigate();
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard();
  const { data: progressData } = useAllCoursesProgress();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [expandedCourseSyllabuses, setExpandedCourseSyllabuses] = useState(null);
  const { data: syllabusesData } = useCourseSyllabuses(expandedCourseSyllabuses);

  const allCourses = coursesData?.data || [];
  const enrolledCourseIds = dashboardData?.data?.enrolledCourses?.map(c => c.id) || [];
  const progressMap = (progressData?.courses || []).reduce((acc, p) => ({
    ...acc,
    [p.id]: p.progress_percentage,
  }), {});
  
  const enrolledCourses = allCourses.filter(c => enrolledCourseIds.includes(c.id));
  const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id) && c.status === 'published');

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setShowEnrollment(true);
  };

  const handleEnrollmentSuccess = () => {
    setShowEnrollment(false);
    setSelectedCourse(null);
  };

  const toggleSyllabuses = (courseId) => {
    setExpandedCourseSyllabuses(expandedCourseSyllabuses === courseId ? null : courseId);
  };

  if (coursesLoading || dashboardLoading) {
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
        {/* Enrolled Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 My Enrolled Courses ({enrolledCourses.length})</h2>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-40 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden rounded-t-lg flex items-center justify-center">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, rgb(96, 165, 250) 0%, rgb(168, 85, 247) 100%)';
                        }}
                      />
                    ) : null}
                    {!course.thumbnail && (
                      <div className="text-white text-5xl">📚</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-700">Progress</span>
                        <span className="text-xs font-medium text-blue-600">{progressMap[course.id] || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressMap[course.id] || 0}%` }}></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Continue Learning
                      </button>
                      <button
                        onClick={() => navigate(`/student/courses/${course.id}`)}
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        📊 Details
                      </button>
                      <button
                        onClick={() => toggleSyllabuses(course.id)}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        📋 Syllabus
                      </button>
                    </div>

                    {expandedCourseSyllabuses === course.id && (
                      <div className="mt-4 border-t pt-4">
                        {syllabusesData?.data?.length > 0 ? (
                          <div className="space-y-3">
                            {syllabusesData.data.map((syllabus) => (
                              <div key={syllabus.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-800 text-sm mb-2">{syllabus.title}</h4>
                                <p className="text-xs text-gray-600 mb-2">{syllabus.description}</p>
                                {syllabus.outlines && syllabus.outlines.length > 0 && (
                                  <div className="space-y-2">
                                    {syllabus.outlines.map((outline, idx) => (
                                      <div key={outline.id} className="flex gap-2 text-xs">
                                        <span className="text-blue-600 font-bold">{idx + 1}.</span>
                                        <div className="flex-1">
                                          {outline.image && (
                                            <img src={outline.image} alt={outline.title} className="w-full h-12 object-cover rounded mb-1" />
                                          )}
                                          <p className="text-gray-700 font-medium">{outline.title}</p>
                                          {outline.description && <p className="text-gray-600 line-clamp-1">{outline.description}</p>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center">No syllabus available for this course.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
              <p className="text-sm text-gray-500">Browse available courses below to get started!</p>
            </div>
          )}
        </div>

        {/* Available Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎓 Available Courses ({availableCourses.length})</h2>
          {availableCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative w-full h-40 bg-gradient-to-br from-green-400 to-teal-500 overflow-hidden rounded-t-lg flex items-center justify-center">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, rgb(74, 222, 128) 0%, rgb(20, 184, 166) 100%)';
                        }}
                      />
                    ) : null}
                    {!course.thumbnail && (
                      <div className="text-white text-5xl">🎓</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {course.level || 'Beginner'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-blue-600">${course.price}</p>
                        <p className="text-xs text-gray-500">{course.category}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEnroll(course)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Enroll Now
                      </button>
                      <button
                        onClick={() => toggleSyllabuses(course.id)}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        📋 Syllabus
                      </button>
                    </div>

                    {expandedCourseSyllabuses === course.id && (
                      <div className="mt-4 border-t pt-4">
                        {syllabusesData?.data?.length > 0 ? (
                          <div className="space-y-3">
                            {syllabusesData.data.map((syllabus) => (
                              <div key={syllabus.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-800 text-sm mb-2">{syllabus.title}</h4>
                                <p className="text-xs text-gray-600 mb-2">{syllabus.description}</p>
                                {syllabus.outlines && syllabus.outlines.length > 0 && (
                                  <div className="space-y-2">
                                    {syllabus.outlines.map((outline, idx) => (
                                      <div key={outline.id} className="flex gap-2 text-xs">
                                        <span className="text-blue-600 font-bold">{idx + 1}.</span>
                                        <div className="flex-1">
                                          {outline.image && (
                                            <img src={outline.image} alt={outline.title} className="w-full h-12 object-cover rounded mb-1" />
                                          )}
                                          <p className="text-gray-700 font-medium">{outline.title}</p>
                                          {outline.description && <p className="text-gray-600 line-clamp-1">{outline.description}</p>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center">No syllabus available for this course.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollment && selectedCourse && (
        <EnrollmentModal
          course={selectedCourse}
          onClose={() => setShowEnrollment(false)}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
    </DashboardLayout>
  );
};
