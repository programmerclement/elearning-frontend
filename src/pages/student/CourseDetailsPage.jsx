import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourse, useChapterExercises, useCompleteChapter } from '../../hooks/useApi';
import ExamModal from '../../components/modals/ExamModal';

export const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(courseId);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const { data: exercisesData } = useChapterExercises(selectedChapter?.id);
  const { mutate: completeChapter, isPending: isCompleting } = useCompleteChapter();
  const [showExam, setShowExam] = useState(false);
  const [completedChapters, setCompletedChapters] = useState(new Set());

  const course = courseData?.data || {};
  const chapters = course.chapters || [];
  const exercises = exercisesData?.data || [];

  const handleStartExam = (chapter) => {
    setSelectedChapter(chapter);
    setShowExam(true);
  };

  const handleCompleteChapter = (chapterId) => {
    completeChapter(chapterId, {
      onSuccess: () => {
        setCompletedChapters(new Set([...completedChapters, chapterId]));
        setShowExam(false);
      },
    });
  };

  if (isLoadingCourse) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <button
          onClick={() => navigate('/student/courses')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
        >
          ← Back to Courses
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{course.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{course.description}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>👨‍🏫 {course.instructor_name || 'Instructor'}</span>
            <span>💰 {(Number(course.price) || 0).toFixed(2)} RWF</span>
            <span>📊 {course.level || 'Beginner'}</span>
          </div>
        </div>

        {/* Chapters and Exercises */}
        {chapters.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Course Content</h2>
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{chapter.title}</h3>
                      <p className="text-gray-600 text-sm mt-2">{chapter.description}</p>
                    </div>
                    {completedChapters.has(chapter.id) && (
                      <span className="text-green-600 text-2xl">✓</span>
                    )}
                  </div>

                  {/* Chapter Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStartExam(chapter)}
                      disabled={completedChapters.has(chapter.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        completedChapters.has(chapter.id)
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {completedChapters.has(chapter.id) ? '✓ Completed' : 'Take Exam'}
                    </button>
                  </div>

                  {/* Exercises Info */}
                  {chapter.exercises && chapter.exercises.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800">
                        📋 {chapter.exercises.length} Exercise{chapter.exercises.length !== 1 ? 's' : ''} in this chapter
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No chapters available yet.</p>
          </div>
        )}

        {/* Course Progress */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Your Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${chapters.length > 0 ? (completedChapters.size / chapters.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedChapters.size} of {chapters.length} chapters completed
          </p>
        </div>
      </div>

      {/* Exam Modal */}
      {showExam && selectedChapter && (
        <ExamModal
          chapter={selectedChapter}
          exercises={exercises}
          onClose={() => {
            setShowExam(false);
            setSelectedChapter(null);
          }}
          onComplete={() => handleCompleteChapter(selectedChapter.id)}
          isLoading={isCompleting}
        />
      )}
    </DashboardLayout>
  );
};
