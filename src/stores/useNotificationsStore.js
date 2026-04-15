import { create } from 'zustand';

/**
 * Notifications Store - Manages global notifications
 */
export const useNotificationsStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  selectedCategory: 'all',

  // Add a new notification
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.is_read ? 0 : 1),
    })),

  // Mark notification as read
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  // Mark all as read
  markAllAsRead: () =>
    set({
      notifications: (state) =>
        state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    }),

  // Set all notifications
  setNotifications: (notifications) =>
    set((state) => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    })),

  // Clear notifications
  clear: () => set({ notifications: [], unreadCount: 0 }),

  // Remove notification
  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    })),
}));
