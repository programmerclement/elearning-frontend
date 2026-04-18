import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../Icons';

export const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Validate avatar URL - check if it's a valid and complete data/HTTP URL
  const isValidAvatarUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return false;
    // Check if it's a data URL - should be reasonably long (at least 100 chars for valid base64)
    if (url.startsWith('data:')) {
      return url.length > 100 && url.includes(',');
    }
    // Check if it's an http URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.length > 10;
    }
    // Check if it's a relative path
    if (url.startsWith('/')) {
      return url.length > 1;
    }
    return false;
  };

  // Get background color based on initials
  const getBackgroundColor = (name) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-8 py-3">
        {/* Left: Logo and Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-blue-600">Academia</h1>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          {/* User Info (hidden on mobile) */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none"
            >
              {isValidAvatarUrl(user?.avatar) ? (
                <img
                  src={user.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getBackgroundColor(
                  user?.name
                )}`}
                style={{display: isValidAvatarUrl(user?.avatar) ? 'none' : 'flex'}}
              >
                {getInitials(user?.name)}
              </div>
            </button>

            {/* Dropdown Menu Items */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 sm:hidden">
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="p-4 border-b border-gray-200 hidden sm:block text-center">
                  {isValidAvatarUrl(user?.avatar) ? (
                    <img
                      src={user.avatar}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-2 ${getBackgroundColor(
                      user?.name
                    )}`}
                    style={{display: isValidAvatarUrl(user?.avatar) ? 'none' : 'flex'}}
                  >
                    {getInitials(user?.name)}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">{user?.role}</p>
                </div>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
