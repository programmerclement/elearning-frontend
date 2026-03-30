import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/apiService';

export default function LessonHistoryTable() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('enrollment_count');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, [page, limit, search]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getLessonsHistory(
        page,
        limit,
        search
      );
      if (response.success) {
        setLessons(response.data || []);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.pages) setPage(page + 1);
  };

  const getLevelBadge = (level) => {
    const levelConfig = {
      beginner: { bg: 'bg-green-100', text: 'text-green-800', icon: '🟢' },
      intermediate: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🔵' },
      advanced: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🟣' },
      expert: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' },
    };
    const config = levelConfig[level?.toLowerCase()] || levelConfig.beginner;
    return config;
  };

  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4.5) return 'text-yellow-500';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-orange-300';
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
        <p className="font-semibold mb-4">⚠️ {error}</p>
        <button
          onClick={fetchLessons}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Lessons History</h2>
          <p className="text-sm text-gray-500">Online Courses & Past Payments</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search lessons..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium transition">
            🔍 Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Assignment Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total Students
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Avg. Score
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tot. Profits (USD)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : lessons.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg">No lessons found</p>
                  <p className="text-sm">Try adjusting your search filters</p>
                </td>
              </tr>
            ) : (
              lessons.map((lesson, idx) => {
                const levelBadge = getLevelBadge(lesson.level);
                return (
                  <tr
                    key={lesson.id}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-400">
                          #{idx + (page - 1) * limit + 1}
                        </span>
                      </div>
                    </td>

                    {/* Assignment Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {lesson.thumbnail && (
                          <img
                            src={lesson.thumbnail}
                            alt={lesson.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 max-w-xs truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lesson.instructor_name || 'Instructor'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Type/Level */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${levelBadge.bg} ${levelBadge.text}`}
                      >
                        {levelBadge.icon} {lesson.level || 'Course'}
                      </span>
                    </td>

                    {/* Total Students */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {lesson.enrollment_count?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lesson.enrollment_count &&
                          lesson.enrollment_count > 100
                          ? '2.6K'
                          : "450"} Views
                      </div>
                    </td>

                    {/* Avg Score */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {typeof lesson.avg_rating === 'number'
                          ? lesson.avg_rating.toFixed(2)
                          : '-'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {lesson.review_count || 0} reviews
                      </div>
                    </td>

                    {/* Rating Stars */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-lg ${getRatingColor(lesson.avg_rating)}`}>
                          ⭐
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {typeof lesson.avg_rating === 'number'
                            ? lesson.avg_rating.toFixed(1)
                            : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Profit */}
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-bold text-green-600">
                        $
                        {lesson.price
                          ? (lesson.price * (lesson.enrollment_count || 0))
                            .toFixed(2)
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          : '0'}{' '}
                        USD
                      </div>
                      <div className="text-xs text-gray-500">
                        {lesson.status ? (
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              lesson.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {lesson.status}
                          </span>
                        ) : (
                          'Active'
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-6 py-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold">
              {(page - 1) * limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold">
              {Math.min(page * limit, pagination.total)}
            </span>{' '}
            of{' '}
            <span className="font-semibold">{pagination.total}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.pages, 5) }).map(
                (_, i) => {
                  const pageNum = i + (Math.max(1, page - 2));
                  return pageNum <= pagination.pages ? (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        pageNum === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                }
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={page >= pagination.pages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
