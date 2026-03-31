import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useStudentDashboard, useUserInvoices } from '../../hooks/useApi';

export const StudentDashboard = () => {
  const { data, isLoading, error } = useStudentDashboard();
  const { data: invoicesData } = useUserInvoices();

  const invoices = invoicesData?.data || [];
  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your learning progress.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm">Enrolled Courses</p>
              <p className="text-3xl font-bold text-blue-600">{data?.data?.enrolledCourses?.length || 0}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm">Progress</p>
              <p className="text-3xl font-bold text-green-600">{data?.data?.progressStats?.progressPercentage || 0}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-purple-600">{(Number(data?.data?.averageScore) || 0).toFixed(1)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-orange-600">{data?.data?.progressStats?.completedChapters || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow p-6 border border-red-200">
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
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
