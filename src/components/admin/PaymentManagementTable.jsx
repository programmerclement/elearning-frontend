import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

/**
 * PaymentManagementTable Component
 * View and manage all platform transactions
 */
export const PaymentManagementTable = ({
  payments = [],
  isLoading = false,
  onApproveClick = () => {},
  onRefundClick = () => {},
}) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const columns = [
    {
      key: 'student_name',
      label: 'Student',
      render: (value) => (
        <div>
          <h4 className="font-semibold text-gray-800">{value}</h4>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, row) => (
        <span className="font-bold text-gray-800">
          ${value.toFixed(2)} {row.currency}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const labels = {
          course_purchase: 'Course',
          subscription: 'Subscription',
          upgrade: 'Upgrade',
          refund: 'Refund',
        };
        return <span className="capitalize">{labels[value] || value}</span>;
      },
    },
    {
      key: 'payment_method',
      label: 'Method',
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          completed: 'success',
          pending: 'warning',
          failed: 'danger',
          refunded: 'default',
        };
        return (
          <Badge
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            variant={variants[value] || 'default'}
          />
        );
      },
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <button
              onClick={() => {
                setSelectedPayment(row);
                setActionType('approve');
                setShowModal(true);
              }}
              className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Approve
            </button>
          )}
          {row.status === 'completed' && (
            <button
              onClick={() => {
                setSelectedPayment(row);
                setActionType('refund');
                setShowModal(true);
              }}
              className="px-2 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
            >
              Refund
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleAction = () => {
    if (!selectedPayment) return;

    if (actionType === 'approve') {
      onApproveClick(selectedPayment.id);
    } else if (actionType === 'refund') {
      onRefundClick(selectedPayment.id);
    }

    setShowModal(false);
    setSelectedPayment(null);
    setActionType(null);
  };

  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Management</h2>
        <Table
          columns={columns}
          data={payments}
          isLoading={isLoading}
          sortable={true}
        />
      </Card>

      <Modal
        isOpen={showModal}
        title={actionType === 'approve' ? 'Approve Payment' : 'Process Refund'}
        onClose={() => {
          setShowModal(false);
          setSelectedPayment(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        confirmText={actionType === 'approve' ? 'Approve' : 'Refund'}
      >
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Amount:</span> ${selectedPayment?.amount.toFixed(2)}
          </p>
          <p>
            <span className="font-semibold">Student:</span> {selectedPayment?.student_name}
          </p>
          <p>
            <span className="font-semibold">Method:</span> {selectedPayment?.payment_method}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{' '}
            {selectedPayment && new Date(selectedPayment.created_at).toLocaleDateString()}
          </p>
        </div>
      </Modal>
    </>
  );
};
