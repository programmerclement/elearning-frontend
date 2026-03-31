import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAllReviews, useCourses, useDeleteReview } from '../../hooks/useApi';

export const AdminReviewsPage = () => {
  const { data: coursesData } = useCourses();
  const { data: allReviews, isLoading, refetch: refetchReviews } = useAllReviews();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const deleteReviewMutation = useDeleteReview();

  const courses = coursesData?.data || [];
  const reviews = Array.isArray(allReviews) ? allReviews : [];

  // Filter reviews by selected course if one is selected
  const filteredReviews = selectedCourseId
    ? reviews.filter(review => review.course_id === selectedCourseId)
    : reviews;

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId, {
        onSuccess: () => {
          refetchReviews();
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">📝 Manage Reviews</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses ({reviews.length})</option>
            {courses.map((course) => {
              const courseReviewCount = reviews.filter(r => r.course_id === course.id).length;
              return (
                <option key={course.id} value={course.id}>
                  {course.title} ({courseReviewCount})
                </option>
              );
            })}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No reviews found {selectedCourseId && 'for this course'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{review.course_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{review.user_name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="flex items-center">
                          {'⭐'.repeat(review.rating)}
                          <span className="ml-1 text-yellow-600 font-semibold">{review.rating}/5</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{review.comment || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
