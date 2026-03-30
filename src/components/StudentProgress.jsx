import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';

/**
 * StudentProgress Component
 * Track chapter completion and quiz scores
 */
export default function StudentProgress({ courseId, userId }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchProgress();
  }, [courseId, userId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/progress', {
        params: { course_id: courseId, user_id: userId },
      });

      if (response.data.success) {
        const data = response.data.data || [];
        setProgress(data);

        // Calculate overall progress
        if (data.length > 0) {
          const completedCount = data.filter((p) => p.completed).length;
          const percentage = (completedCount / data.length) * 100;
          setOverallProgress(Math.round(percentage));
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (chapterId) => {
    try {
      const response = await apiClient.post(
        `/chapters/${chapterId}/complete`
      );

      if (response.data.success) {
        alert('✅ Chapter marked as complete!');
        fetchProgress();
      }
    } catch (err) {
      console.error('Error marking chapter complete:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading progress...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold">Course Completion</p>
          <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Chapter Progress List */}
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : progress.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No progress yet</p>
      ) : (
        <div className="space-y-3">
          {progress.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center ${
                    p.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {p.completed ? '✓' : '○'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {p.chapter?.title || 'Chapter'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Week {p.chapter?.week_number || '?'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {p.completion_percentage}%
                  </p>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>

                {!p.completed && (
                  <button
                    onClick={() => handleMarkComplete(p.chapter_id)}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Mark Done
                  </button>
                )}

                {p.completed && (
                  <span className="text-green-600 font-semibold">✓ Done</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Date if 100% */}
      {overallProgress === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">
            🎉 Congratulations! You have completed this course.
          </p>
        </div>
      )}
    </div>
  );
}
