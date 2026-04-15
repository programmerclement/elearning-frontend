import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

/**
 * CourseManagementTable Component
 * Manage instructor's courses (Create, Edit, Delete, Publish)
 */
export const CourseManagementTable = ({
  courses = [],
  isLoading = false,
  onCreateClick = () => {},
  onEditClick = () => {},
  onDeleteClick = () => {},
  onPublishClick = () => {},
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const columns = [
    {
      key: 'title',
      label: 'Course Title',
      render: (value, row) => (
        <div>
          <h4 className="font-semibold text-gray-800">{value}</h4>
          <p className="text-sm text-gray-600 mt-1">{row.category}</p>
        </div>
      ),
    },
    {
      key: 'total_students',
      label: 'Students',
      render: (value) => <span className="font-bold text-blue-600">{value || 0}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          draft: 'default',
          published: 'success',
          approved: 'primary',
          rejected: 'danger',
          pending_approval: 'warning',
        };
        const labels = {
          draft: 'Draft',
          published: 'Published',
          approved: 'Approved',
          rejected: 'Rejected',
          pending_approval: 'Pending',
        };
        return (
          <Badge
            label={labels[value] || value}
            variant={variants[value] || 'default'}
          />
        );
      },
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEditClick(row)}
            className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          {row.status === 'draft' && (
            <button
              onClick={() => onPublishClick(row)}
              className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Publish
            </button>
          )}
          <button
            onClick={() => {
              setSelectedCourse(row);
              setShowDeleteConfirm(true);
            }}
            className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        <Button variant="primary" onClick={onCreateClick}>
          + Create Course
        </Button>
      </div>

      <Table
        columns={columns}
        data={courses}
        isLoading={isLoading}
        sortable={true}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        title="Delete Course"
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedCourse(null);
        }}
        onConfirm={() => {
          if (selectedCourse) {
            onDeleteClick(selectedCourse.id);
            setShowDeleteConfirm(false);
            setSelectedCourse(null);
          }
        }}
        confirmText="Delete"
        variant="danger"
      >
        <p className="text-gray-700">
          Are you sure you want to delete "{selectedCourse?.title}"? This action cannot be undone.
        </p>
      </Modal>
    </Card>
  );
};
