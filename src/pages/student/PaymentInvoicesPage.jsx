import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useUserInvoices } from '../../hooks/useApi';

export const PaymentInvoicesPage = () => {
  const { data: invoicesData, isLoading, error } = useUserInvoices();

  const invoices = invoicesData?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'refunded':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: { text: '✓ Paid', color: 'bg-green-500' },
      pending: { text: '⏳ Pending', color: 'bg-yellow-500' },
      failed: { text: '✕ Failed', color: 'bg-red-500' },
      refunded: { text: '↩ Refunded', color: 'bg-blue-500' },
    };
    return badges[status] || { text: status, color: 'bg-gray-500' };
  };

  const formatCurrency = (amount) => {
    return `${Number(amount).toFixed(2)} RWF`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">💳 Payment & Invoices</h1>
          <p className="text-gray-600">Track your course payments and download invoices</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading invoices...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-red-900 font-bold text-lg mb-2">Error Loading Invoices</h2>
            <p className="text-red-700">{error.message || 'Failed to load your invoices. Please try again.'}</p>
          </div>
        )}

        {!isLoading && !error && invoices.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-semibold mb-2">No Invoices Yet</p>
            <p className="text-gray-400 text-sm">Enroll in your first course to generate an invoice</p>
          </div>
        )}

        {!isLoading && !error && invoices.length > 0 && (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
                <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{invoices.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
                <p className="text-gray-600 text-sm font-medium">Total Paid</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(
                    invoices
                      .filter(inv => inv.status === 'paid')
                      .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
                  )}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
                <p className="text-gray-600 text-sm font-medium">Pending Amount</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {formatCurrency(
                    invoices
                      .filter(inv => inv.status === 'pending')
                      .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
                  )}
                </p>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Invoice ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoices.map((invoice) => {
                      const statusBadge = getStatusBadge(invoice.status);
                      return (
                        <tr key={invoice.id} className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${getStatusColor(invoice.status)}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-gray-900">#{invoice.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {invoice.course_title || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900">{formatCurrency(invoice.total)}</span>
                            <div className="text-xs text-gray-500 mt-1">
                              Subtotal: {formatCurrency(invoice.subtotal)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${statusBadge.color}`}>
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(invoice.created_at)}</div>
                            {invoice.paid_at && (
                              <div className="text-xs text-green-600 mt-1">
                                Paid: {formatDate(invoice.paid_at)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                              title="Download invoice"
                            >
                              📄 View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Breakdown Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Invoice Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-2">Per Invoice Details:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <span className="font-medium">Subtotal:</span> Course price</li>
                    <li>• <span className="font-medium">Service Fee:</span> 5% of subtotal</li>
                    <li>• <span className="font-medium">VAT:</span> 15% of (subtotal + service fee)</li>
                    <li>• <span className="font-medium">Total:</span> Subtotal + Service Fee + VAT</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-2">Payment Methods:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Credit Card</li>
                    <li>• Online Payment</li>
                    <li>• PayPal</li>
                    <li>• Bank Transfer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
