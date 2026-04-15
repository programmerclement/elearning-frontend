import React from 'react';
import { Card } from '../common/Card';

/**
 * InstructorMetrics Component
 * Display instructor KPI metrics
 */
export const InstructorMetrics = ({
  metrics = {
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeEnrollments: 0,
  } = {},
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* Total Courses */}
      <Card className="border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.totalCourses}</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>
      </Card>

      {/* Total Students */}
      <Card className="border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-green-600">{metrics.totalStudents}</p>
          </div>
          <div className="text-4xl">👥</div>
        </div>
      </Card>

      {/* Total Revenue */}
      <Card className="border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600">
              {typeof metrics.totalRevenue === 'number'
                ? `$${metrics.totalRevenue.toFixed(2)}`
                : '$0.00'}
            </p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </Card>

      {/* Active Enrollments */}
      <Card className="border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Active Enrollments</p>
            <p className="text-3xl font-bold text-yellow-600">{metrics.activeEnrollments}</p>
          </div>
          <div className="text-4xl">⭐</div>
        </div>
      </Card>

      {/* Average Rating */}
      <Card className="border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Avg Rating</p>
            <p className="text-3xl font-bold text-orange-600">
              {metrics.averageRating.toFixed(1)}
              <span className="text-lg">/5</span>
            </p>
          </div>
          <div className="text-4xl">⭐</div>
        </div>
      </Card>
    </div>
  );
};
