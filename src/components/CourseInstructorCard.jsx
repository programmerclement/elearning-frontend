import React, { useState, useEffect } from 'react';
import { followersAPI, usersAPI, courseAPI } from '../../api/apiService';

/**
 * CourseInstructorCard
 * Display instructor info with follow button on course pages
 */
export default function CourseInstructorCard({ instructorId, currentUserId }) {
  const [instructor, setInstructor] = useState(null);
  const [stats, setStats] = useState({
    followers: 0,
    courses: 0,
    rating: 0,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorData();
  }, [instructorId]);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);

      // Fetch instructor profile
      const instructorRes = await usersAPI.getUserProfile(instructorId);
      if (instructorRes.success) {
        setInstructor(instructorRes.data);
      }

      // Fetch followers count
      const followersRes = await followersAPI.getFollowers(instructorId);
      const followers = followersRes.data || [];

      // Fetch courses
      const coursesRes = await courseAPI.listCourses({
        instructor_id: instructorId,
      });
      const courses = coursesRes.data || [];

      // Calculate average rating
      let avgRating = 0;
      if (courses.length > 0) {
        const totalRating = courses.reduce(
          (sum, course) => sum + (course.rating || 0),
          0
        );
        avgRating = (totalRating / courses.length).toFixed(1);
      }

      setStats({
        followers: followers.length,
        courses: courses.length,
        rating: avgRating,
      });

      // Check if current user follows this instructor
      if (currentUserId && instructorId !== currentUserId) {
        const checkRes = await followersAPI.checkFollowing(currentUserId, instructorId);
        setIsFollowing(checkRes.data?.is_following || false);
      }
    } catch (err) {
      console.error('Error fetching instructor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await followersAPI.unfollowUser(currentUserId, instructorId);
        setIsFollowing(false);
        alert('✅ Unfollowed');
      } else {
        // Follow
        await followersAPI.followUser(currentUserId, instructorId);
        setIsFollowing(true);
        alert('✅ Followed');
      }
      fetchInstructorData();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        Loading instructor...
      </div>
    );
  }

  if (!instructor) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-100">
      {/* Instructor Avatar & Name */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {instructor.avatar ? (
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            instructor.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{instructor.name}</h3>
          <p className="text-sm text-gray-600">👨‍🏫 Instructor</p>
          {instructor.bio && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {instructor.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-blue-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.followers}</p>
          <p className="text-xs text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.courses}</p>
          <p className="text-xs text-gray-600">Courses</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
            ⭐ {stats.rating}
          </p>
          <p className="text-xs text-gray-600">Avg Rating</p>
        </div>
      </div>

      {/* Follow Button */}
      {currentUserId && instructorId !== currentUserId && (
        <button
          onClick={handleFollowToggle}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isFollowing
              ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isFollowing ? '✓ Following' : '+ Follow Instructor'}
        </button>
      )}

      {/* Email */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600">Contact</p>
        <p className="text-sm font-medium text-gray-900">{instructor.email}</p>
      </div>
    </div>
  );
}
