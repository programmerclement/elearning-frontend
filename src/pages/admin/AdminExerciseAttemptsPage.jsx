import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useCourseAllAttempts } from '../../hooks/useApi';

export const AdminExerciseAttemptsPage = () => {
  const { data: coursesData } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { data: attemptsData } = useCourseAllAttempts(selectedCourseId);

  const courses = coursesData?.data || [];
  const attempts = attemptsData && Array.isArray(attemptsData) ? attemptsData : attemptsData?.data || [];

  const stats = {
    total: attempts.length,
    correct: attempts.filter((a) => a.is_correct).length,
    incorrect: attempts.filter((a) => !a.is_correct).length,
    avgScore: attempts.length > 0 ? (attempts.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / attempts.length * 100).toFixed(2) : 0,
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score) * 100;
    if (numScore >= 70) return 'bg-green-100 text-green-700';
    if (numScore >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Exercise Attempts</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Attempts</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Correct</p>
            <p className="text-3xl font-bold text-green-600">{stats.correct}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Incorrect</p>
            <p className="text-3xl font-bold text-red-600">{stats.incorrect}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Average Score</p>
            <p className="text-3xl font-bold text-purple-600">{stats.avgScore}%</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {attempts.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No exercise attempts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Exercise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Chapter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Answer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Attempted</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{attempt.student_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{attempt.exercise_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{attempt.chapter_title}</td>
                      <td className="px-6 py-4 text-sm">
                        {attempt.is_correct ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">✓ Correct</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">✗ Incorrect</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(attempt.score)}`}>
                          {(attempt.score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{attempt.answer || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(attempt.attempted_at).toLocaleString()}</td>
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
