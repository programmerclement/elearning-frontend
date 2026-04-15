import React from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';

/**
 * StudentTrackingTable Component
 * Track students enrolled in a specific course
 */
export const StudentTrackingTable = ({
  students = [],
  isLoading = false,
  courseTitle = 'Course',
  onStudentClick = () => {},
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.avatar_url || `https://ui-avatars.com/api/?name=${value}`}
            alt={value}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{value}</h4>
            <p className="text-sm text-gray-600">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'progress_percentage',
      label: 'Progress',
      render: (value) => (
        <div className="w-32">
          <div className="flex justify-between text-xs mb-1">
            <span>{Math.round(value)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variants = {
          active: 'success',
          completed: 'primary',
          suspended: 'danger',
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
      key: 'enrolled_at',
      label: 'Enrolled',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'last_accessed_at',
      label: 'Last Active',
      render: (value) => {
        if (!value) return 'Never';
        return new Date(value).toLocaleDateString();
      },
    },
  ];

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Student Progress: {courseTitle}
      </h2>
      <Table
        columns={columns}
        data={students}
        isLoading={isLoading}
        sortable={true}
        onRowClick={onStudentClick}
      />
    </Card>
  );
};
