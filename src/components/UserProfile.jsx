import React, { useState, useEffect } from 'react';
import { followersAPI, usersAPI, courseAPI, reviewAPI } from '../../api/apiService';
import Followers from './Followers';

/**
 * UserProfile Component
 * Display user profile with avatar, bio, followers, following, and courses
 */
export default function UserProfile({ userId, currentUserId }) {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
    courses: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

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

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const userRes = await usersAPI.getUserProfile(userId);
      if (userRes.success) {
        setUser(userRes.data);
      }

      // Fetch user's courses (if instructor)
      const coursesRes = await courseAPI.listCourses({
        instructor_id: userId,
      });
      if (coursesRes.success) {
        setCourses(coursesRes.data || []);
      }

      // Fetch follower stats
      const followersRes = await followersAPI.getFollowers(userId);
      const followers = followersRes.data || [];

      const followingRes = await followersAPI.getFollowing(userId);
      const following = followingRes.data || [];

      // Fetch review count - need to check if this endpoint exists
      let reviews = [];
      try {
        const reviewsRes = await reviewAPI.listReviews({
          user_id: userId,
        });
        reviews = reviewsRes.data || [];
      } catch (err) {
        console.log('Could not fetch reviews');
      }

      setStats({
        followers: followers.length,
        following: following.length,
        courses: courses.length,
        reviews: reviews.length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-16 text-red-600">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 flex-shrink-0">
            {isValidAvatarUrl(user?.avatar) ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.textContent = user.name?.charAt(0).toUpperCase() || '';
                }}
              />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            <p className="text-blue-100 mb-4 capitalize">
              {user.role} • {user.email}
            </p>
            {user.bio && (
              <p className="text-blue-50 max-w-2xl">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-400">
          <div>
            <p className="text-blue-200 text-sm font-semibold">Followers</p>
            <p className="text-3xl font-bold">{stats.followers}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm font-semibold">Following</p>
            <p className="text-3xl font-bold">{stats.following}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm font-semibold">
              {user.role === 'instructor' ? 'Courses' : 'Enrolled'}
            </p>
            <p className="text-3xl font-bold">{stats.courses}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm font-semibold">Reviews</p>
            <p className="text-3xl font-bold">{stats.reviews}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b bg-white rounded-t-lg p-4">
        <button
          onClick={() => setActiveTab('about')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'about'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          About
        </button>
        {user.role === 'instructor' && (
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'courses'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Courses ({courses.length})
          </button>
        )}
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'community'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Community
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-md p-6">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-gray-600">
                {user.bio || 'No bio provided yet'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email
                </h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Role
                </h3>
                <p className="text-gray-600 capitalize">
                  {user.role} {user.role === 'instructor' && '👨‍🏫'}
                  {user.role === 'student' && '👨‍🎓'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Member Since
              </h3>
              <p className="text-gray-600">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && user.role === 'instructor' && (
          <div>
            {courses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No courses yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {course.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {course.subtitle}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          {course.duration_weeks || 8} weeks
                        </span>
                        <span>
                          ⭐ {course.rating || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <Followers userId={userId} currentUserId={currentUserId} />
        )}
      </div>
    </div>
  );
}
