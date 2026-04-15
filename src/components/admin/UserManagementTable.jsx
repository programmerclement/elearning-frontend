import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

/**
 * UserManagementTable Component
 * Manage all users - activate, suspend, manage roles
 */
export const UserManagementTable = ({
  users = [],
  isLoading = false,
  onSuspendClick = () => {},
  onActivateClick = () => {},
  onDeleteClick = () => {},
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const columns = [
    {
      key: 'name',
      label: 'User',
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
      key: 'role',
      label: 'Role',
      render: (value) => {
        const variants = {
          admin: 'primary',
          instructor: 'info',
          learner: 'default',
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
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <Badge
          label={value ? 'Active' : 'Suspended'}
          variant={value ? 'success' : 'danger'}
        />
      ),
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          {row.is_active ? (
            <button
              onClick={() => {
                setSelectedUser(row);
                setActionType('suspend');
                setShowActionModal(true);
              }}
              className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedUser(row);
                setActionType('activate');
                setShowActionModal(true);
              }}
              className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Activate
            </button>
          )}
          <button
            onClick={() => {
              setSelectedUser(row);
              setActionType('delete');
              setShowActionModal(true);
            }}
            className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleAction = () => {
    if (!selectedUser) return;

    if (actionType === 'suspend') {
      onSuspendClick(selectedUser.id);
    } else if (actionType === 'activate') {
      onActivateClick(selectedUser.id);
    } else if (actionType === 'delete') {
      onDeleteClick(selectedUser.id);
    }

    setShowActionModal(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const getModalTitle = () => {
    const titles = {
      suspend: 'Suspend User',
      activate: 'Activate User',
      delete: 'Delete User',
    };
    return titles[actionType] || 'Confirm Action';
  };

  const getModalMessage = () => {
    const messages = {
      suspend: `Suspend ${selectedUser?.name}? They will not be able to access their account.`,
      activate: `Activate ${selectedUser?.name}? They will regain access to their account.`,
      delete: `Delete ${selectedUser?.name}? This action cannot be undone.`,
    };
    return messages[actionType] || 'Are you sure?';
  };

  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
        <Table
          columns={columns}
          data={users}
          isLoading={isLoading}
          sortable={true}
        />
      </Card>

      <Modal
        isOpen={showActionModal}
        title={getModalTitle()}
        onClose={() => {
          setShowActionModal(false);
          setSelectedUser(null);
          setActionType(null);
        }}
        onConfirm={handleAction}
        variant={actionType === 'delete' ? 'danger' : 'default'}
        confirmText={actionType === 'delete' ? 'Delete' : 'Confirm'}
      >
        <p className="text-gray-700">{getModalMessage()}</p>
      </Modal>
    </>
  );
};
