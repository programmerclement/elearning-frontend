import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../api/apiService';

export default function CourseReviewPage({ courseId, onClose }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(courseId);
      if (response.success) {
        setCourse(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading course details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-6 rounded-lg">
        {error}
        <button
          onClick={fetchCourse}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-12">No course found</div>;
  }

  const chapters = course.chapters || [];

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-xl opacity-90">{course.subtitle}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Course Overview */}
      <div className="p-8 border-b">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-2xl font-bold text-blue-600">
              {course.duration_weeks}w
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-gray-600">Hours/Week</p>
            <p className="text-2xl font-bold text-green-600">
              {course.required_hours_per_week}h
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded">
            <p className="text-sm text-gray-600">Level</p>
            <p className="text-2xl font-bold text-orange-600 capitalize">
              {course.education_level}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <p className="text-sm text-gray-600">Chapters</p>
            <p className="text-2xl font-bold text-purple-600">{chapters.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-gray-700">Description</h3>
            <p className="text-gray-600 mt-1">{course.description}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700">Introduction</h3>
            <p className="text-gray-600 mt-1">{course.intro_message}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700">Learning Objectives</h3>
            <p className="text-gray-600 mt-1">{course.objectives}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-700">Target Audience</h3>
            <p className="text-gray-600 mt-1">{course.target_audience}</p>
          </div>

          {course.price && (
            <div>
              <h3 className="font-bold text-gray-700">Pricing</h3>
              <div className="mt-1 flex gap-4">
                <div>
                  <p className="text-sm text-gray-600">One-Time</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {course.price} RWF
                  </p>
                </div>
                {course.subscription_price > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Subscription</p>
                    <p className="text-2xl font-bold text-green-600">
                      {course.subscription_price} RWF/mo
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapters & Exercises */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>

        {chapters.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No chapters added yet
          </p>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter, idx) => (
              <div
                key={chapter.id}
                className="border rounded-lg overflow-hidden"
              >
                {/* Chapter Header */}
                <button
                  onClick={() =>
                    setExpandedChapter(
                      expandedChapter === chapter.id ? null : chapter.id
                    )
                  }
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {chapter.week_number || idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {chapter.title}
                      </h3>
                      {chapter.subtitle && (
                        <p className="text-sm text-gray-600">
                          {chapter.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {chapter.exercises?.length || 0} exercises
                    </span>
                    <span className="text-lg">
                      {expandedChapter === chapter.id ? '−' : '+'}
                    </span>
                  </div>
                </button>

                {/* Chapter Details */}
                {expandedChapter === chapter.id && (
                  <div className="p-4 bg-white border-t">
                    {chapter.intro_message && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Introduction:
                        </p>
                        <p className="text-gray-700">{chapter.intro_message}</p>
                      </div>
                    )}

                    {chapter.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Description:
                        </p>
                        <p className="text-gray-700">{chapter.description}</p>
                      </div>
                    )}

                    {chapter.duration && (
                      <p className="text-sm text-gray-600 mb-4">
                        Duration: <strong>{chapter.duration} minutes</strong>
                      </p>
                    )}

                    {chapter.video_url && (
                      <a
                        href={chapter.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
                      >
                        → Watch Video
                      </a>
                    )}

                    {chapter.attachments?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 font-semibold mb-2">
                          Attachments:
                        </p>
                        <ul className="space-y-1">
                          {chapter.attachments.map((att, i) => (
                            <li key={i} className="text-sm text-blue-600">
                              📎 {att}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exercises */}
                    {chapter.exercises?.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-bold text-gray-900 mb-3">
                          Exercises & Quizzes
                        </h4>
                        <div className="space-y-3">
                          {chapter.exercises.map((exercise, exIdx) => (
                            <div
                              key={exercise.id}
                              className="bg-gray-50 p-3 rounded border-l-4 border-yellow-400"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <p className="font-semibold text-gray-900">
                                  {exIdx + 1}. {exercise.question}
                                </p>
                                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded capitalize">
                                  {exercise.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Points: <strong>{exercise.points}</strong>
                              </p>

                              {exercise.type === 'radio' ||
                              exercise.type === 'checkbox' ? (
                                <div className="mt-2 space-y-1">
                                  {exercise.options?.map((opt, oIdx) => (
                                    <label
                                      key={oIdx}
                                      className="flex items-center text-sm text-gray-700"
                                    >
                                      <input
                                        type={exercise.type}
                                        disabled
                                        checked={opt.is_correct}
                                        className="mr-2"
                                      />
                                      {opt.label}
                                      {opt.is_correct && (
                                        <span className="ml-2 text-green-600 font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                exercise.correct_answer && (
                                  <p className="text-sm text-green-600 mt-2">
                                    Answer: <strong>{exercise.correct_answer}</strong>
                                  </p>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="p-8 border-t bg-gray-50 flex items-center justify-between">
        <div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              course.status === 'published'
                ? 'bg-green-100 text-green-800'
                : course.status === 'draft'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {course.status.toUpperCase()}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close Review
          </button>
        )}
      </div>
    </div>
  );
}
