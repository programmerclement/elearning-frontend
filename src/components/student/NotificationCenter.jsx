import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

/**
 * NotificationCenter Component
 * Display notifications with categories
 */
export const NotificationCenter = ({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const categories = {
    course_update: { label: 'Course Update', color: 'info', icon: '📚' },
    payment: { label: 'Payment', color: 'success', icon: '💳' },
    certificate: { label: 'Certificate', color: 'primary', icon: '🏆' },
    announcement: { label: 'Announcement', color: 'warning', icon: '📢' },
  };

  const getCategoryInfo = (type) => {
    return categories[type] || { label: 'Notification', color: 'default', icon: '🔔' };
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Modal */}
      <Modal
        isOpen={isOpen}
        title="Notifications"
        onClose={() => setIsOpen(false)}
        size="lg"
        showFooter={false}
      >
        <div className="max-h-96 overflow-y-auto">
          {/* Header with Mark All as Read */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="font-semibold text-gray-800">
              All Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-600">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => {
                const category = getCategoryInfo(notif.type);
                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotification(notif)}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                      notif.is_read
                        ? 'bg-gray-50 border-gray-300'
                        : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-xl mt-1">{category.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {notif.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notif.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <Modal
          isOpen={!!selectedNotification}
          title="Notification Details"
          onClose={() => {
            setSelectedNotification(null);
            if (!selectedNotification.is_read) {
              onMarkAsRead(selectedNotification.id);
            }
          }}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {selectedNotification.title}
              </h3>
              <p className="text-gray-700">{selectedNotification.message}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                {new Date(selectedNotification.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
