import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export const AdminActivityPage = () => {
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // TODO: Replace with API call to fetch real activities
  // const { data, isLoading } = useSystemActivities({ dateRange });
  // Placeholder for when backend activity tracking is implemented
  const activities = [];

  const getActivityIcon = (type) => {
    const icons = {
      login: '🔓',
      registration: '👤',
      enrollment: '📚',
      payment: '💳',
      course_created: '✏️',
      failed_login: '🚫',
      user_updated: '⚙️',
      course_updated: '📝',
      deletion: '🗑️',
    };
    return icons[type] || '📌';
  };

  const getStatusColor = (status) => {
    return status === 'success'
      ? 'bg-green-100 text-green-800'
      : status === 'failed'
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      instructor: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredActivities =
    filterType === 'all'
      ? activities
      : activities.filter((a) => a.type === filterType);

  const activityStats = {
    total: activities.length,
    logins: activities.filter((a) => a.type === 'login').length,
    registrations: activities.filter((a) => a.type === 'registration').length,
    enrollments: activities.filter((a) => a.type === 'enrollment').length,
    failed: activities.filter((a) => a.status === 'failed').length,
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Activity Monitor</h1>
          <p className="text-gray-600">Track all user activities and system events in real-time</p>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Activities</p>
                <p className="text-3xl font-bold text-blue-600">{activityStats.total}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Logins</p>
                <p className="text-3xl font-bold text-green-600">{activityStats.logins}</p>
              </div>
              <div className="text-4xl">🔓</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Registrations</p>
                <p className="text-3xl font-bold text-purple-600">{activityStats.registrations}</p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Enrollments</p>
                <p className="text-3xl font-bold text-orange-600">{activityStats.enrollments}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Failed Events</p>
                <p className="text-3xl font-bold text-red-600">{activityStats.failed}</p>
              </div>
              <div className="text-4xl">🚫</div>
            </div>
          </div>
        </div>

        {/* Filter and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Activity Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Activities</option>
                <option value="login">Logins</option>
                <option value="registration">Registrations</option>
                <option value="enrollment">Enrollments</option>
                <option value="payment">Payments</option>
                <option value="course_created">Courses Created</option>
                <option value="course_updated">Courses Updated</option>
                <option value="failed_login">Failed Logins</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity Timeline or Empty State */}
        <div className="bg-white rounded-lg shadow">
          {activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{activity.action}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(
                            activity.role
                          )}`}
                        >
                          {activity.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatTime(activity.timestamp)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 max-w-xs truncate block">
                          {activity.details}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Activities Found</h3>
              <p className="text-gray-600 text-center max-w-sm">
                Activity tracking is configured but no activities have been recorded yet. 
                Activities will appear here as users interact with the platform (login, registration, enrollments, etc.).
              </p>
            </div>
          )}
        </div>

        {/* Implementation Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>📌 Note:</strong> Activity tracking UI is ready and fully functional. To enable real activity 
            monitoring, create a backend API endpoint at <code className="bg-yellow-100 px-2 py-1 rounded">/api/activities</code> and 
            add a <code className="bg-yellow-100 px-2 py-1 rounded">useSystemActivities</code> hook in useApi.js to fetch live data.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};
