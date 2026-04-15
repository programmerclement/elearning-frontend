import React from 'react';
import { Card } from '../common/Card';

/**
 * AdminMetrics Component
 * Display admin KPI metrics
 */
export const AdminMetrics = ({
  metrics = {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    platformEngagement: 0,
  } = {},
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {/* Total Users */}
      <Card className="border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.totalUsers}</p>
          </div>
          <div className="text-4xl">👥</div>
        </div>
      </Card>

      {/* Active Users (30 days) */}
      <Card className="border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Active (30d)</p>
            <p className="text-3xl font-bold text-green-600">{metrics.activeUsers}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </Card>

      {/* Total Courses */}
      <Card className="border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-purple-600">{metrics.totalCourses}</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>
      </Card>

      {/* Total Revenue */}
      <Card className="border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-yellow-600">
              ${(metrics.totalRevenue || 0).toFixed(2)}
            </p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </Card>

      {/* Platform Engagement */}
      <Card className="border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Engagement</p>
            <p className="text-3xl font-bold text-orange-600">
              {metrics.platformEngagement.toFixed(1)}%
            </p>
          </div>
          <div className="text-4xl">📊</div>
        </div>
      </Card>
    </div>
  );
};
