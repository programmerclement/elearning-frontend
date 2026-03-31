import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAllCoursesProgress } from '../../hooks/useApi';

export const StudentProgressPage = () => {
  const { data: progressData, isLoading: progressLoading, error: progressError } = useAllCoursesProgress();

  // Extract progress from nested data structure
  const progressInfo = progressData?.data?.progress || [];

  // Calculate statistics (matching course card logic)
  const totalEnrolled = progressInfo.length;
  const completedCourses = progressInfo.filter(p => p.completed_at && (p.percentage || 0) === 100).length;
  const inProgressCourses = progressInfo.filter(p => (p.percentage || 0) > 0 && (p.percentage || 0) < 100).length;
  const notStartedCourses = progressInfo.filter(p => (p.percentage || 0) === 0).length;
  const avgScore = progressInfo.length > 0 
    ? Math.min(100, Math.round(progressInfo.reduce((sum, p) => sum + Math.min(100, p.percentage || 0), 0) / progressInfo.length))
    : 0;

  if (progressLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-center mt-4">Loading your progress...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (progressError) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-900 font-bold text-lg mb-2">Error Loading Progress</h2>
            <p className="text-red-700">{progressError.message || 'Failed to load your progress. Please try again.'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">📚 My Learning Progress</h1>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Courses Enrolled</p>
                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">{totalEnrolled}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">{completedCourses}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl sm:text-4xl font-bold text-orange-600 mt-2">{inProgressCourses}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Progress</p>
                <p className="text-3xl sm:text-4xl font-bold text-purple-600 mt-2">{avgScore}%</p>
              </div>
              <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Course Progress List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Progress Details</h2>
          {progressInfo.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg mb-2 font-semibold">No Courses Enrolled Yet</p>
              <p className="text-gray-400 text-sm">Start your learning journey by exploring available courses</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {progressInfo.map((progress) => {
                const percentage = Math.min(100, Math.max(0, progress.percentage || 0));
                const isCompleted = progress.completed_at && percentage === 100;
                const isNotStarted = percentage === 0;

                return (
                  <div 
                    key={progress.course_id}
                    className={`rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : isNotStarted
                        ? 'border-gray-300 bg-white'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    {/* Course Header with Thumbnail */}
                    <div className="relative h-40 bg-gradient-to-r from-gray-200 to-gray-300 overflow-hidden">
                      {progress.thumbnail ? (
                        <img
                          src={progress.thumbnail}
                          alt={progress.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                          <span className="text-6xl">📖</span>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {isCompleted && (
                          <span className="inline-block px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                            ✓ Completed
                          </span>
                        )}
                        {!isCompleted && !isNotStarted && (
                          <span className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-full shadow-lg">
                            ⏳ In Progress
                          </span>
                        )}
                        {isNotStarted && (
                          <span className="inline-block px-4 py-2 bg-gray-600 text-white text-sm font-bold rounded-full shadow-lg">
                            ⭕ Not Started
                          </span>
                        )}
                      </div>

                      {/* Progress Percentage Overlay */}
                      <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-lg font-bold">
                        {Math.round(percentage)}%
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{progress.title}</h3>
                      
                      {/* Chapter Progress */}
                      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">
                          📚 Chapters: <span className="font-bold text-blue-600">{progress.completed_chapters}/{progress.total_chapters}</span> completed
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                          <span className="text-sm font-bold text-gray-900">{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                          <div 
                            className={`h-4 rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-green-500' : isNotStarted ? 'bg-gray-400' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-600">
                          {isCompleted && progress.completed_at && (
                            <span className="text-green-600 font-semibold">✅ Completed on {new Date(progress.completed_at).toLocaleDateString()}</span>
                          )}
                          {!isCompleted && !isNotStarted && (
                            <span className="text-orange-600 font-semibold">{Math.round(100 - percentage)}% to complete</span>
                          )}
                          {isNotStarted && (
                            <span className="text-gray-500 italic">Ready to start learning</span>
                          )}
                        </div>
                        <div className="text-right">
                          {isCompleted ? (
                            <span className="text-green-600 font-bold">🎉 Finished!</span>
                          ) : !isNotStarted ? (
                            <span className="text-blue-600 font-semibold">→ Continue learning</span>
                          ) : (
                            <span className="text-gray-500 font-semibold">→ Start course</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Info */}
        {progressInfo.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-900">
              <span className="font-semibold">💡 Tip:</span> Complete all chapters in a course to mark it as finished. Your progress is automatically tracked as you complete each chapter.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
