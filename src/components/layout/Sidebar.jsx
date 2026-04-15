import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../Icons';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isStudent, isInstructor, isAdmin } = useAuth();

  const studentMenuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: 'Dashboard' },
    { name: 'My Courses', path: '/student/courses', icon: 'Courses' },
    { name: 'My Projects', path: '/student/projects', icon: 'Projects' },
    { name: 'My Progress', path: '/student/progress', icon: 'Progress' },
    { name: 'Payments', path: '/student/payments', icon: 'Invoices' },
  ];

  const instructorMenuItems = [
    { name: 'Dashboard', path: '/instructor/dashboard', icon: 'Dashboard' },
    { name: 'My Courses', path: '/instructor/courses', icon: 'Courses' },
    { name: 'Students', path: '/instructor/students', icon: 'Users' },
  ];

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'Dashboard' },
    { name: 'Courses', path: '/admin/courses', icon: 'Courses' },
    { name: 'Users', path: '/admin/users', icon: 'Users' },
    { name: 'Reviews', path: '/admin/reviews', icon: 'Reviews' },
    { name: 'Enrollments', path: '/admin/enrollments', icon: 'Enrollments' },
    { name: 'Exercises', path: '/admin/exercises', icon: 'Exercises' },
    { name: 'Exercise Attempts', path: '/admin/exercise-attempts', icon: 'Attempts' },
    { name: 'Invoices', path: '/admin/invoices', icon: 'Invoices' },
    { name: 'Syllabuses', path: '/admin/syllabuses', icon: 'Syllabuses' },
    { name: 'Syllabus Outlines', path: '/admin/syllabus-outlines', icon: 'Outlines' },
    { name: 'User Progress', path: '/admin/user-progress', icon: 'Progress' },
  ];

  const getMenuItems = () => {
    if (isStudent) return studentMenuItems;
    if (isInstructor) return instructorMenuItems;
    if (isAdmin) return adminMenuItems;
    return [];
  };

  const getIconComponent = (iconName) => {
    return Icons[iconName] || Icons.Dashboard;
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg transition-transform duration-300 z-40 lg:z-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button (Mobile) */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-blue-400">Menu</h2>
          <p className="text-xs text-gray-400 mt-2 capitalize">{user?.role} Portal</p>
        </div>

        {/* Menu Items - Scrollable */}
        <nav className="mt-6 px-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="w-6 h-6 flex-shrink-0">
                {getIconComponent(item.icon)}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            Academia Platform v1.0
          </p>
        </div>
      </aside>
    </>
  );
};
