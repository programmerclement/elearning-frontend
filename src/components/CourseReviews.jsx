import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

/**
 * CourseReviewsComponent
 * Display and manage course reviews with ratings
 */
export default function CourseReviews({ courseId, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/reviews`, {
        params: { course_id: courseId },
      });
      if (response.data.success) {
        setReviews(response.data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      setSubmitting(true);
      const response = await apiClient.post('/reviews', {
        course_id: courseId,
        rating: parseInt(formData.rating),
        comment: formData.comment,
      });

      if (response.data.success) {
        alert('✅ Review submitted successfully!');
        setFormData({ rating: 5, comment: '' });
        setShowForm(false);
        fetchReviews();
        if (onReviewAdded) onReviewAdded(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

      {/* Add Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Your Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5 stars)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, rating: star }))
                  }
                  className={`text-3xl transition ${
                    star <= formData.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience with this course..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-center py-8">Loading reviews...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
