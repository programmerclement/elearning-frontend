import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

/**
 * UserProfileBlock Component
 * Display user avatar, name, role, location, email, and plan
 */
export const UserProfileBlock = ({ user = {}, onEditClick }) => {
  if (!user || !user.id) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center py-6 text-gray-500">Loading profile...</div>
      </Card>
    );
  }

  const getPlanColor = (plan) => {
    const colors = {
      free: 'default',
      premium: 'info',
      academia: 'primary',
    };
    return colors[plan] || 'default';
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <img
            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
            alt={user.name}
            className="w-16 h-16 rounded-full border-4 border-white shadow"
          />

          {/* Profile Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
            <p className="text-gray-600 text-sm capitalize">{user.role}</p>

            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
              {user.location && <p>📍 {user.location}</p>}
              {user.email && <p>✉️ {user.email}</p>}
              {user.phone && <p>📞 {user.phone}</p>}
            </div>

            <div className="mt-3">
              <Badge
                label={`${(user.plan || 'Free').toUpperCase()} Plan`}
                variant={getPlanColor(user.plan)}
              />
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
    </Card>
  );
};
