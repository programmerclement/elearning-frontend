import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DashboardHeader Component
 * Displays user profile, stats, and action buttons
 */
export const DashboardHeader = ({ user, stats }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-lg p-6 md:p-8 text-white mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold">Hi, {user?.name || 'Student'}</h2>
            <p className="text-blue-100 mt-1">{user?.email || 'student@example.com'}</p>
            {user?.location && (
              <p className="text-blue-100 text-sm mt-1">📍 {user.location}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to={`/student/profile/${user?.id}`}
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Subscription Badge (Optional) */}
      {stats?.subscription && (
        <div className="mt-6 bg-blue-500 bg-opacity-40 border border-blue-300 rounded-lg p-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{stats.subscription}</span>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
