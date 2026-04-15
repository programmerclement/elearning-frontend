import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useStudentDashboard, useUserInvoices } from '../../hooks/useApi';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { DashboardStats } from '../../components/student/DashboardStats';
import { RecentEnrolledCourses } from '../../components/student/RecentEnrolledCourses';
import { Calendar } from '../../components/student/Calendar';

export const StudentDashboard = () => {
  const { data, isLoading, error } = useStudentDashboard();
  const { data: invoicesData } = useUserInvoices();

  const invoices = invoicesData?.data || [];
  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const dashboardData = data?.data || {};
  const user = dashboardData.user;
  const stats = dashboardData.stats || {};
  const recentCourses = dashboardData.recentCourses || [];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading dashboard</p>
            <p>{error.message}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && !error && user && (
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <DashboardHeader
              user={user}
              stats={{
                subscription: 'Upgraded to Academia plan',
              }}
            />

            {/* Stats Cards */}
            <DashboardStats stats={stats} />

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent Courses Section - Takes 2 columns on lg */}
              <div className="lg:col-span-2">
                <RecentEnrolledCourses courses={recentCourses} />
              </div>

              {/* Side Panel - Calendar and Other Info */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                {/* Calendar */}
                <Calendar />

                {/* Spending Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Spending</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {totalSpent.toFixed(2)} RWF
                    </div>
                    <p className="text-gray-600 text-sm">Total spent on courses</p>
                    <div className="mt-4 bg-blue-50 rounded p-3">
                      <p className="text-xs text-gray-600">
                        💡 <span className="font-semibold">Tip:</span> Invest in your learning journey
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Goals</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm">Complete by end of month</span>
                      <span className="text-xl font-bold text-green-600">{stats.inProgress || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-green-500 rounded-full transition-all"
                        style={{ width: `${Math.min(((stats.completed || 0) / (stats.totalEnrolled || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {stats.completed || 0} of {stats.totalEnrolled || 0} courses completed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* All Enrolled Courses Summary */}
            {dashboardData.enrolledCourses && dashboardData.enrolledCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  All Enrolled Courses ({dashboardData.enrolledCourses.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Level</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.enrolledCourses.map((course) => (
                        <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-sm text-gray-700 font-medium">{course.title}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {course.level || 'Beginner'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                <div
                                  className="h-2 bg-blue-600 rounded-full"
                                  style={{ width: `${course.progress_percentage || 0}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                                {course.progress_percentage || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              course.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : course.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {course.completed_chapters}/{course.total_chapters}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !error && !user && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No data available
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

