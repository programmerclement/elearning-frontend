import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourse, useCreateChapter, useCreateExercise } from '../../hooks/useApi';
import { ChapterFormModal } from '../../components/modals/ChapterFormModal';
import { ExerciseFormModal } from '../../components/modals/ExerciseFormModal';

export const CourseChaptersPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: courseData, isLoading } = useCourse(courseId);
  const { mutate: createChapter, isPending: isCreatingChapter } = useCreateChapter();
  const { mutate: createExercise, isPending: isCreatingExercise } = useCreateExercise();

  const [showChapterForm, setShowChapterForm] = useState(false);
  const [selectedChapterForExercise, setSelectedChapterForExercise] = useState(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const course = courseData?.data || {};
  const chapters = course.chapters || [];

  const handleAddChapter = (chapterData) => {
    const formData = new FormData();
    formData.append('title', chapterData.title);
    formData.append('description', chapterData.description);
    if (chapterData.thumbnail) {
      formData.append('thumbnail', chapterData.thumbnail);
    }

    createChapter(
      { courseId, formData },
      {
        onSuccess: () => {
          setShowChapterForm(false);
        },
      }
    );
  };

  const handleAddExercise = (exerciseData) => {
    createExercise(
      {
        chapterId: selectedChapterForExercise.id,
        data: exerciseData,
      },
      {
        onSuccess: () => {
          setShowExerciseForm(false);
          setSelectedChapterForExercise(null);
        },
      }
    );
  };

  if (isLoading) {
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
        <div className="mb-8">
          <button
            onClick={() => navigate('/instructor/courses')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>

        {/* Add Chapter Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowChapterForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Add Chapter
          </button>
        </div>

        {/* Chapters List */}
        {chapters.length > 0 ? (
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="bg-white rounded-lg shadow">
                {/* Chapter Header */}
                <div
                  onClick={() =>
                    setExpandedChapter(
                      expandedChapter === chapter.id ? null : chapter.id
                    )
                  }
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Chapter {index + 1}: {chapter.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      {chapter.thumbnail && (
                        <span className="flex items-center gap-1">
                          🖼️ Has thumbnail
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        🧪 {chapter.exercises?.length || 0} exercises
                      </span>
                    </div>
                  </div>
                  <span className="text-2xl text-gray-400">
                    {expandedChapter === chapter.id ? '▼' : '▶'}
                  </span>
                </div>

                {/* Chapter Content (Expanded) */}
                {expandedChapter === chapter.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Exercises Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-800">Exercises</h4>
                        <button
                          onClick={() => {
                            setSelectedChapterForExercise(chapter);
                            setShowExerciseForm(true);
                          }}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                        >
                          + Add Exercise
                        </button>
                      </div>

                      {chapter.exercises?.length > 0 ? (
                        <div className="space-y-2">
                          {chapter.exercises.map((exercise, exIndex) => (
                            <div
                              key={exercise.id}
                              className="bg-white p-4 rounded border border-gray-200"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    Q{exIndex + 1}: {exercise.question}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Type: <span className="font-semibold">{exercise.type}</span>
                                  </p>
                                  {exercise.options && (
                                    <div className="mt-2 text-xs text-gray-600">
                                      <p className="font-medium">Options:</p>
                                      <ul className="list-disc list-inside">
                                        {Array.isArray(exercise.options)
                                          ? exercise.options.map((opt, i) => (
                                              <li key={i}>{opt}</li>
                                            ))
                                          : typeof exercise.options === 'string'
                                          ? exercise.options
                                              .split(',')
                                              .map((opt, i) => <li key={i}>{opt.trim()}</li>)
                                          : null}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                                <button className="text-red-600 hover:text-red-800 text-sm">
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded border border-gray-200 text-center text-gray-600">
                          No exercises yet. Add one to get started!
                        </div>
                      )}
                    </div>

                    {/* Edit/Delete Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button className="flex-1 bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition-colors text-sm font-medium">
                        ✏️ Edit Chapter
                      </button>
                      <button className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors text-sm font-medium">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No chapters yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Add chapters to your course and include exercises for students
            </p>
            <button
              onClick={() => setShowChapterForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create First Chapter
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Chapters</p>
            <p className="text-3xl font-bold text-blue-600">{chapters.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Exercises</p>
            <p className="text-3xl font-bold text-green-600">
              {chapters.reduce((sum, ch) => sum + (ch.exercises?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Course Status</p>
            <p className="text-lg font-semibold">
              <span
                className={`px-3 py-1 rounded-full ${
                  course.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {course.status || 'Draft'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showChapterForm && (
        <ChapterFormModal
          onClose={() => setShowChapterForm(false)}
          onSubmit={handleAddChapter}
          isLoading={isCreatingChapter}
        />
      )}

      {showExerciseForm && selectedChapterForExercise && (
        <ExerciseFormModal
          chapter={selectedChapterForExercise}
          onClose={() => {
            setShowExerciseForm(false);
            setSelectedChapterForExercise(null);
          }}
          onSubmit={handleAddExercise}
          isLoading={isCreatingExercise}
        />
      )}
    </DashboardLayout>
  );
};
