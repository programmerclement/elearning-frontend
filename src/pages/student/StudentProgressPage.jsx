import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useAllCoursesProgress } from '../../hooks/useApi';

export const StudentProgressPage = () => {
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: progressData, isLoading: progressLoading } = useAllCoursesProgress();

  const courses = coursesData?.data || [];
  const progressInfo = progressData?.progress || [];

  // Calculate statistics
  const totalEnrolled = courses.length;
  const completedCourses = progressInfo.filter(p => p.percentage === 100).length;
  const avgScore = progressInfo.length > 0 
    ? Math.round(progressInfo.reduce((sum, p) => sum + (p.percentage || 0), 0) / progressInfo.length)
    : 0;

  // Create a map of course progress by course_id
  const progressMap = {};
  progressInfo.forEach(p => {
    progressMap[p.course_id] = p;
  });

  if (coursesLoading || progressLoading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">My Learning Progress</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Courses Enrolled</p>
            <p className="text-3xl font-bold text-blue-600">{totalEnrolled}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Courses Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedCourses}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Overall Progress</p>
            <p className="text-3xl font-bold text-purple-600">{avgScore}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Chapters Done</p>
            <p className="text-3xl font-bold text-orange-600">
              {progressInfo.reduce((sum, p) => sum + (p.completed_chapters || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
          {courses.length === 0 ? (
            <p className="text-gray-600">No enrolled courses yet</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => {
                const progress = progressMap[course.id] || { percentage: 0, completed_chapters: 0, total_chapters: 0 };
                const percentage = progress.percentage || 0;
                return (
                  <div key={course.id}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-medium">{course.title}</span>
                        <p className="text-xs text-gray-500">
                          {progress.completed_chapters || 0}/{progress.total_chapters || 0} chapters
                        </p>
                      </div>
                      <span className="text-sm text-gray-600 font-semibold">{Math.round(percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          percentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
