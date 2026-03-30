import React, { useState, useEffect } from 'react';
import { followersAPI } from '../../api/apiService';

/**
 * FollowersComponent
 * Manage followers/following relationships
 */
export default function Followers({ userId, currentUserId }) {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    fetchFollowerData();
  }, [userId]);

  const fetchFollowerData = async () => {
    try {
      setLoading(true);

      // Fetch followers list
      const followersRes = await followersAPI.getFollowers(userId);
      if (followersRes.success) {
        setFollowers(followersRes.data || []);
      }

      // Fetch following list
      const followingRes = await followersAPI.getFollowing(userId);
      if (followingRes.success) {
        setFollowing(followingRes.data || []);
      }

      // Check if current user follows this user
      if (currentUserId && userId !== currentUserId) {
        const checkRes = await followersAPI.checkFollowing(currentUserId, userId);
        setIsFollowing(checkRes.data?.is_following || false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load follower data');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await followersAPI.unfollowUser(currentUserId, userId);
        setIsFollowing(false);
        alert('✅ Unfollowed');
      } else {
        // Follow
        await followersAPI.followUser(currentUserId, userId);
        setIsFollowing(true);
        alert('✅ Followed');
      }
      fetchFollowerData();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community</h2>
        {currentUserId !== userId && (
          <button
            onClick={handleFollowToggle}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              isFollowing
                ? 'bg-gray-400 text-white hover:bg-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('followers')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'followers'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Followers ({followers.length})
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'following'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Following ({following.length})
        </button>
      </div>

      {/* Followers List */}
      {activeTab === 'followers' && (
        <div className="space-y-3">
          {followers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No followers yet</p>
          ) : (
            followers.map((follower) => (
              <div
                key={follower.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {follower.user?.avatar ? (
                      <img
                        src={follower.user.avatar}
                        alt={follower.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      follower.user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {follower.user?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {follower.user?.role}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  Since {new Date(follower.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Following List */}
      {activeTab === 'following' && (
        <div className="space-y-3">
          {following.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Not following anyone</p>
          ) : (
            following.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">
                    {f.user?.avatar ? (
                      <img
                        src={f.user.avatar}
                        alt={f.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      f.user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {f.user?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {f.user?.role}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  Following since {new Date(f.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
