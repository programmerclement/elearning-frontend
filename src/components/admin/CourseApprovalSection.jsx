import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

/**
 * CourseApprovalSection Component
 * Review and approve/reject instructor courses
 */
export const CourseApprovalSection = ({
  courses = [],
  isLoading = false,
  onApproveClick = () => {},
  onRejectClick = () => {},
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const pendingCourses = courses.filter(c => c.approval_status === 'pending');

  const columns = [
    {
      key: 'title',
      label: 'Course',
      render: (value, row) => (
        <div>
          <h4 className="font-semibold text-gray-800">{value}</h4>
          <p className="text-sm text-gray-600">by {row.instructor_name}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: 'total_chapters',
      label: 'Chapters',
      render: (value) => <span className="font-bold">{value}</span>,
    },
    {
      key: 'created_at',
      label: 'Submitted',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedCourse(row);
              setActionType('approve');
              setShowModal(true);
            }}
            className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Approve
          </button>
          <button
            onClick={() => {
              setSelectedCourse(row);
              setActionType('reject');
              setShowModal(true);
            }}
            className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const handleAction = () => {
    if (!selectedCourse) return;

    if (actionType === 'approve') {
      onApproveClick(selectedCourse.id);
    } else if (actionType === 'reject') {
      onRejectClick(selectedCourse.id, rejectReason);
    }

    setShowModal(false);
    setSelectedCourse(null);
    setActionType(null);
    setRejectReason('');
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Course Approval
            <span className="ml-2 text-sm font-normal text-yellow-600">
              ({pendingCourses.length} pending)
            </span>
          </h2>
        </div>

        {pendingCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-600">No pending courses to review</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={pendingCourses}
            isLoading={isLoading}
            sortable={true}
          />
        )}
      </Card>

      {/* Approval Modal */}
      <Modal
        isOpen={showModal}
        title={actionType === 'approve' ? 'Approve Course' : 'Reject Course'}
        onClose={() => {
          setShowModal(false);
          setSelectedCourse(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        variant={actionType === 'reject' ? 'danger' : 'default'}
        confirmText={actionType === 'approve' ? 'Approve' : 'Reject'}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800">{selectedCourse?.title}</h3>
            <p className="text-sm text-gray-600 mt-1">by {selectedCourse?.instructor_name}</p>
          </div>

          {actionType === 'approve' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✓ This course will be published and visible to all students.
              </p>
            </div>
          )}

          {actionType === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this course is being rejected..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
              />
              <p className="text-sm text-gray-600 mt-2">
                The instructor will receive this feedback.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
