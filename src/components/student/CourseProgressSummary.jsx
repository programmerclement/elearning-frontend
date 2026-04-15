import React from 'react';
import { Card } from '../common/Card';

/**
 * CourseProgressSummary Component
 * Display course completion statistics
 */
export const CourseProgressSummary = ({ stats = {} }) => {
  const {
    completedCourses = 0,
    inProgressCourses = 0,
    notStartedCourses = 0,
    progressPercentage = 0,
  } = stats;

  const totalCourses = completedCourses + inProgressCourses + notStartedCourses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Enrolled Courses */}
      <Card className="border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Enrolled</p>
            <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>
      </Card>

      {/* In Progress */}
      <Card className="border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600">{inProgressCourses}</p>
          </div>
          <div className="text-4xl">🔄</div>
        </div>
      </Card>

      {/* Completed */}
      <Card className="border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCourses}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </Card>

      {/* Not Started */}
      <Card className="border-l-4 border-gray-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Not Started</p>
            <p className="text-3xl font-bold text-gray-600">{notStartedCourses}</p>
          </div>
          <div className="text-4xl">⭕</div>
        </div>
      </Card>

      {/* Overall Progress */}
      <Card className="border-l-4 border-purple-500">
        <div>
          <p className="text-gray-600 text-sm">Overall Progress</p>
          <p className="text-3xl font-bold text-purple-600 mb-2">{Math.round(progressPercentage)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
