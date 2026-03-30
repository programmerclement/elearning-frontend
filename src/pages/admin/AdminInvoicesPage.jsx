import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export const AdminInvoicesPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices', 'admin'],
    queryFn: async () => {
      const response = await apiClient.get('/payments');
      return response.data;
    },
  });

  const payments = invoicesData?.data || [];

  const filteredPayments = filterStatus === 'all' 
    ? payments 
    : payments.filter((p) => p.status === filterStatus);

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    failed: payments.filter((p) => p.status === 'failed').length,
    totalRevenue: payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Invoices & Payments</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Failed</p>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Transactions</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{payment.user_name || payment.student_name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{payment.course_title || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">${parseFloat(payment.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{payment.payment_method || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
