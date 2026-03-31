import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/apiService';

/**
 * Professional Metrics Card Component
 * Based on Onmarazza dashboard design
 */
const ProfessionalMetricCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  trend = 0, 
  bgColor = 'bg-gradient-to-br from-blue-50 to-blue-100',
  iconBg = 'bg-blue-500',
  textColor = 'text-blue-600'
}) => {
  const trendUp = trend > 0;
  
  return (
    <div className={`${bgColor} rounded-lg shadow-lg p-6 border border-blue-200 hover:shadow-xl transition duration-300`}>
      <div className="flex items-start justify-between">
        {/* Left Side - Icon & Value */}
        <div className="flex-1">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-12 h-12 ${iconBg} rounded-lg text-white mb-3`}>
            <span className="text-lg">{icon}</span>
          </div>
          
          {/* Main Value */}
          <h3 className={`text-3xl font-bold ${textColor} mt-4`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          
          {/* Title */}
          <p className="text-gray-700 font-semibold text-sm mt-2">{title}</p>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right Side - Trend Indicator */}
        <div className="text-right">
          <div className={`flex items-center gap-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            <span className="text-xl">
              {trendUp ? '📈' : '📉'}
            </span>
            <span className="text-sm font-bold">
              {Math.abs(trend)}%
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {trendUp ? 'Increased' : 'Decreased'} from last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getMetrics();
      if (response.success) {
        setMetrics(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-semibold mb-4">⚠️ {error}</p>
        <button
          onClick={fetchMetrics}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-center py-16 text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Primary Metrics - 4 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Growth - Total Students */}
        <ProfessionalMetricCard
          icon="👥"
          title="Students in Total"
          value={`${(metrics.total_students / 1000).toFixed(1)}K`}
          subtitle="Active enrollments"
          trend={12.5}
          bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
          iconBg="bg-blue-500"
          textColor="text-blue-700"
        />

        {/* Exams - Average Score */}
        <ProfessionalMetricCard
          icon="📝"
          title="Average Score"
          value={`${metrics.average_score?.toFixed(2) || 0}`}
          subtitle="From all exams"
          trend={8.3}
          bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
          iconBg="bg-orange-500"
          textColor="text-orange-700"
        />

        {/* Certificates - Total Issued */}
        <ProfessionalMetricCard
          icon="🏆"
          title="Certificates"
          value={metrics.total_certificates || 0}
          subtitle="Courses completed"
          trend={15.2}
          bgColor="bg-gradient-to-br from-green-50 to-green-100"
          iconBg="bg-green-500"
          textColor="text-green-700"
        />

        {/* Assignments */}
        <ProfessionalMetricCard
          icon="📋"
          title="Total Assignments"
          value={metrics.total_assignments || 0}
          subtitle="Published exercises"
          trend={5.8}
          bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          iconBg="bg-purple-500"
          textColor="text-purple-700"
        />
      </div>

      {/* Secondary Metrics - If available */}
      {metrics.published_courses && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Published Courses</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  {metrics.published_courses}
                </p>
              </div>
              <div className="text-3xl">📚</div>
            </div>
          </div>

          {metrics.total_revenue && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {metrics.total_revenue.toFixed(2)} RWF
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>
          )}

          {metrics.attendance_percentage && (
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Attendance Rate</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">
                    {metrics.attendance_percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-3xl">✓</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
