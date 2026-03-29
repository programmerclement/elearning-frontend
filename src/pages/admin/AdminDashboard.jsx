import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAdminDashboard } from '../../hooks/useApi';

export const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminDashboard();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log('AdminDashboard loaded - isLoading:', isLoading, 'error:', error, 'data:', data);
  }, [isLoading, error, data]);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the entire platform and monitor system health.</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading dashboard</p>
            <p>{error.message}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{data?.data?.users?.total || 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-green-600">{data?.data?.courses?.total || 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${(Number(data?.data?.revenue?.total_revenue) || 0).toFixed(2)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <p className="text-gray-600 text-sm">Transactions</p>
                <p className="text-3xl font-bold text-orange-600">{data?.data?.revenue?.total_transactions || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {data?.data?.users?.byRole?.student || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Instructors</span>
                    <span className="font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {data?.data?.users?.byRole?.instructor || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Admins</span>
                    <span className="font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {data?.data?.users?.byRole?.admin || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{data?.data?.courses?.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Published</span>
                    <span className="font-semibold bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      {data?.data?.courses?.published || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Draft</span>
                    <span className="font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                      {data?.data?.courses?.draft || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Total Chapters</span>
                    <span className="font-semibold">{data?.data?.totalChapters || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-green-600">
                      ${(Number(data?.data?.revenue?.total_revenue) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Paid Orders</span>
                    <span className="font-semibold">{data?.data?.revenue?.paid_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Avg Transaction</span>
                    <span className="font-semibold">
                      ${(
                        (Number(data?.data?.revenue?.total_transactions) || 0) > 0
                          ? Number(data?.data?.revenue?.total_revenue) / Number(data?.data?.revenue?.total_transactions)
                          : 0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.recentUsers?.length > 0 ? (
                      data?.data?.recentUsers?.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
                                user.role === 'student'
                                  ? 'bg-blue-100 text-blue-700'
                                  : user.role === 'instructor'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-xs">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
                          No recent users
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!isLoading && !error && !data && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No data available
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
