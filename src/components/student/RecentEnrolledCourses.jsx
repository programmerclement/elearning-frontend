import React from 'react';
import { Link } from 'react-router-dom';

/**
 * RecentEnrolledCourses Component
 * Displays recently enrolled courses with progress
 */
export const RecentEnrolledCourses = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218-.51-4.5-1.385A7.954 7.954 0 009 4.804z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Enrolled Courses Yet</h3>
        <p className="text-gray-600 mb-4">Start learning by enrolling in a course</p>
        <Link
          to="/student/courses"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Enrolled Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/student/courses/${course.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105"
          >
            {/* Thumbnail */}
            <div className="relative h-40 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218-.51-4.5-1.385A7.954 7.954 0 009 4.804z" />
                  </svg>
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    course.status === 'completed'
                      ? 'bg-green-500'
                      : course.status === 'in_progress'
                      ? 'bg-yellow-500'
                      : 'bg-gray-500'
                  }`}
                >
                  {course.status === 'completed' ? 'Completed' : course.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h4>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-semibold text-blue-600">{course.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      course.progress_percentage >= 100
                        ? 'bg-green-500'
                        : course.progress_percentage >= 50
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min(course.progress_percentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Course Info */}
              <div className="flex justify-between text-xs text-gray-600 border-t pt-3 mt-3">
                <span>📚 {course.completed_chapters}/{course.total_chapters} Chapters</span>
                <span className="text-blue-600 font-semibold">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentEnrolledCourses;
