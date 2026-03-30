import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses } from '../../hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export const AdminUserProgressPage = () => {
  const { data: coursesData } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: progressData } = useQuery({
    queryKey: ['progress', 'admin', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) {
        const response = await apiClient.get('/progress');
        return response.data;
      }
      const response = await apiClient.get(`/progress/${selectedCourseId}`);
      return response.data;
    },
    enabled: !!selectedCourseId,
  });

  const courses = coursesData?.data || [];
  
  // Ensure progressList is always an array
  let progressList = [];
  if (progressData) {
    if (Array.isArray(progressData)) {
      progressList = progressData;
    } else if (Array.isArray(progressData.data)) {
      progressList = progressData.data;
    } else if (Array.isArray(progressData.progress)) {
      progressList = progressData.progress;
    }
  }

  // Filter by status
  if (filterStatus === 'completed') {
    progressList = progressList.filter((p) => p.percentage === 100);
  } else if (filterStatus === 'in-progress') {
    progressList = progressList.filter((p) => p.percentage > 0 && p.percentage < 100);
  } else if (filterStatus === 'not-started') {
    progressList = progressList.filter((p) => p.percentage === 0);
  }

  const stats = {
    total: progressList.length,
    completed: progressList.filter((p) => p.percentage === 100).length,
    inProgress: progressList.filter((p) => p.percentage > 0 && p.percentage < 100).length,
    notStarted: progressList.filter((p) => p.percentage === 0).length,
    avgProgress: progressList.length > 0 
      ? Math.round(progressList.reduce((sum, p) => sum + (p.percentage || 0), 0) / progressList.length)
      : 0,
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'bg-green-100 text-green-700';
    if (percentage >= 50) return 'bg-blue-100 text-blue-700';
    if (percentage > 0) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getProgressStatus = (percentage) => {
    if (percentage === 100) return 'Completed';
    if (percentage > 0) return 'In Progress';
    return 'Not Started';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">User Progress Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Progress Records</p>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Not Started</p>
            <p className="text-3xl font-bold text-gray-600">{stats.notStarted}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Average Progress</p>
            <p className="text-3xl font-bold text-purple-600">{stats.avgProgress}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
            <select
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {progressList.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No progress records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Chapters</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Started</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Latest</th>
                  </tr>
                </thead>
                <tbody>
                  {progressList.map((progress, idx) => (
                    <tr key={`${progress.course_id}-${progress.user_id}-${idx}`} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{progress.user_name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{progress.course_title || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {progress.completed_chapters || 0}/{progress.total_chapters || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                progress.percentage >= 70
                                  ? 'bg-green-600'
                                  : progress.percentage >= 50
                                  ? 'bg-yellow-600'
                                  : progress.percentage > 0
                                  ? 'bg-orange-600'
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold">{Math.round(progress.percentage)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getProgressColor(progress.percentage)}`}>
                          {getProgressStatus(progress.percentage)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {progress.started_at ? new Date(progress.started_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {progress.updated_at ? new Date(progress.updated_at).toLocaleDateString() : '-'}
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
