import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourse, useCourseReviews, useUserCourseReview, useCreateReview, useUpdateReview, useDeleteReview, useCourseProgress } from '../../hooks/useApi';

export const StudentCourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: courseData, isLoading: courseLoading } = useCourse(parseInt(courseId));
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useCourseReviews(parseInt(courseId));
  const { data: userReview, isLoading: userReviewLoading, refetch: refetchUserReview } = useUserCourseReview(parseInt(courseId));
  const { data: progressData, isLoading: progressLoading } = useCourseProgress(parseInt(courseId));
  
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const [expandedTab, setExpandedTab] = useState('overview');
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [comment, setComment] = useState(userReview?.comment || '');
  const [hoveredRating, setHoveredRating] = useState(0);

  const course = courseData?.data || courseData;
  const reviews = reviewsData?.reviews || [];
  const stats = reviewsData?.stats || { total_reviews: 0, average_rating: null };
  const progress = progressData?.data?.progress || progressData?.progress || [];
  const progressPercentage = progressData?.data?.percentage || progressData?.percentage || 0;

  // Update form when userReview changes
  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating || 0);
      setComment(userReview.comment || '');
    }
  }, [userReview]);

  const handleSubmitReview = async () => {
    if (!rating) return;
    try {
      if (userReview) {
        await updateReviewMutation.mutateAsync({
          reviewId: userReview.id,
          rating,
          comment: comment || null,
        });
      } else {
        await createReviewMutation.mutateAsync({
          course_id: parseInt(courseId),
          rating,
          comment: comment || null,
        });
      }
      // Refetch reviews and user review after submission
      await refetchReviews();
      await refetchUserReview();
      alert('Review submitted successfully!');
    } catch (err) {
      alert('Error submitting review');
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    if (window.confirm('Delete your review?')) {
      try {
        await deleteReviewMutation.mutateAsync(userReview.id);
        // Refetch after deletion
        await refetchReviews();
        await refetchUserReview();
        setRating(0);
        setComment('');
      } catch (err) {
        alert('Error deleting review');
      }
    }
  };

  if (courseLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading course details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4 text-lg">Course not found</p>
          <button
            onClick={() => navigate('/student/courses')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Courses
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="relative w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
            {!course.thumbnail && (
              <div className="text-white text-6xl">📚</div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">📊 Course Progress</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.round(progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 font-medium">📚 Chapters Completed</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {progress.filter(p => p.completed).length}/{progress.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-xs text-gray-600 font-medium">⭐ Average Rating</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.average_rating ? Number(stats.average_rating).toFixed(1) : 'N/A'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-xs text-gray-600 font-medium">💬 Total Reviews</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.total_reviews || 0}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <p className="text-xs text-gray-600 font-medium">🎯 Difficulty Level</p>
              <p className="text-3xl font-bold text-orange-600 mt-2 capitalize">{course.level || 'Beginner'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setExpandedTab('overview')}
              className={`px-4 py-3 font-medium transition-colors ${
                expandedTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📊 Progress
            </button>
            <button
              onClick={() => setExpandedTab('reviews')}
              className={`px-4 py-3 font-medium transition-colors ${
                expandedTab === 'reviews'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⭐ Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setExpandedTab('myreview')}
              className={`px-4 py-3 font-medium transition-colors ${
                expandedTab === 'myreview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✍️ My Review
            </button>
          </div>

          {/* Progress Tab */}
          {expandedTab === 'overview' && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              {progressLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : progress.length > 0 ? (
                <div className="space-y-3">
                  {progress.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          p.completed ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          {p.completed ? <span className="text-green-600">✓</span> : <span className="text-gray-400">○</span>}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{p.chapter_title}</p>
                          <p className="text-xs text-gray-500">
                            {p.completed ? `Completed on ${new Date(p.completed_at).toLocaleDateString()}` : 'Not completed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No progress data available</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {expandedTab === 'reviews' && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <>
                  {/* Rating Distribution */}
                  {stats.total_reviews > 0 && (
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = stats[`count_${star}_star`] || 0;
                        const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600 w-12">{star}★</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reviews List */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-800">{review.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* My Review Tab */}
          {expandedTab === 'myreview' && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              {userReviewLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {userReview ? 'Your Review' : 'Leave a Review'}
                  </h3>

                  {/* Display Current Review */}
                  {userReview && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < (userReview.rating || 0) ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          Posted {new Date(userReview.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {userReview.comment && (
                        <p className="text-gray-700 text-sm mb-2">{userReview.comment}</p>
                      )}
                      <p className="text-xs text-green-700 font-medium">✓ Review saved successfully</p>
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="text-3xl transition-transform transform hover:scale-110"
                        >
                          <span
                            className={
                              (hoveredRating || rating) >= star
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
                    </p>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this course..."
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={handleSubmitReview}
                      disabled={!rating || createReviewMutation.isPending || updateReviewMutation.isPending}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {userReview ? 'Update Review' : 'Submit Review'}
                    </button>
                    {userReview && (
                      <button
                        onClick={handleDeleteReview}
                        disabled={deleteReviewMutation.isPending}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/student/courses')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Courses
        </button>
      </div>
    </DashboardLayout>
  );
};
