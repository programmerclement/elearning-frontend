import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/client';

/**
 * Format price as RWF currency
 * Safely converts to number before formatting
 */
const formatPrice = (value) => {
  const num = parseFloat(value) || 0;
  return `${num.toFixed(2)} RWF`;
};

/**
 * Step 4: Review
 * Shows complete course structure with all chapters and exercises
 * Allows publishing the course
 */
const Step4Review = ({ formData, invoicePreview, onPublish, isPublishing }) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!formData.courseId) {
          setError('No course ID provided');
          setLoading(false);
          return;
        }

        const response = await axiosInstance.get(`/courses/${formData.courseId}`);
        const courseInfo = response.data?.data || response.data;
        
        if (!courseInfo) {
          setError('Invalid course data received from server');
          setLoading(false);
          return;
        }
        
        setCourseData(courseInfo);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [formData.courseId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4 text-lg">⚠️ {error}</div>
        <p className="text-gray-500 text-sm">Course ID: {formData.courseId}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="text-center py-12">
        <div className="text-orange-600 mb-4 text-lg">⚠️ Course data not available</div>
        <p className="text-gray-500 text-sm">Please complete Steps 1-2 first and proceed to Step 3.</p>
      </div>
    );
  }

  const totalChapters = courseData.chapters?.length || 0;
  const totalExercises = courseData.chapters?.reduce((sum, ch) => sum + (ch.exercises?.length || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Course Review</h2>
      <p className="text-gray-600">Review your complete course structure before publishing</p>

      {/* Course Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <SummaryCard
          label="Total Chapters"
          value={totalChapters}
          icon="📚"
        />
        <SummaryCard
          label="Total Exercises"
          value={totalExercises}
          icon="✏️"
        />
        <SummaryCard
          label="Duration"
          value={`${courseData.duration_weeks || 'N/A'} weeks`}
          icon="⏱️"
        />
        <SummaryCard
          label="Price"
          value={formatPrice(courseData.subscription_price)}
          icon="💰"
        />
      </div>

      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-3 sm:p-6 text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">{courseData.title}</h3>
        <p className="text-sm sm:text-base text-blue-100 mb-4 line-clamp-3">{courseData.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge label={courseData.category} color="bg-blue-500" />
          <Badge label={`${courseData.education_level} Level`} color="bg-indigo-500" />
          <Badge label={`${courseData.language} Language`} color="bg-purple-500" />
        </div>
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h4 className="text-sm sm:text-base font-semibold mb-3">Target Audience</h4>
          <p className="text-xs sm:text-sm text-gray-700">{courseData.target_audience}</p>
        </div>
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h4 className="text-sm sm:text-base font-semibold mb-3">Learning Objectives</h4>
          <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap line-clamp-5">{courseData.objectives}</p>
        </div>
      </div>

      {/* Chapters & Exercises */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Course Structure</h3>
        <div className="space-y-3">
          {courseData.chapters && courseData.chapters.length > 0 ? (
            courseData.chapters.map((chapter, idx) => (
              <ChapterReviewCard
                key={chapter.id}
                chapter={chapter}
                index={idx + 1}
                expanded={expandedChapter === chapter.id}
                onToggle={() => setExpandedChapter(
                  expandedChapter === chapter.id ? null : chapter.id
                )}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              <p>No chapters added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Summary */}
      {invoicePreview && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 sm:p-6 border border-green-200">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-900">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">{formatPrice(invoicePreview.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-700">Service Fee:</span>
              <span className="font-semibold">{formatPrice(invoicePreview.service_fee)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-700">VAT:</span>
              <span className="font-semibold">{formatPrice(invoicePreview.vat)}</span>
            </div>
            {invoicePreview.discount_amount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-green-600">
                <span>Discount:</span>
                <span className="font-semibold">-{formatPrice(invoicePreview.discount_amount)}</span>
              </div>
            )}
            <div className="border-t-2 border-green-300 pt-3 flex justify-between">
              <span className="font-bold text-green-900">Total:</span>
              <span className="text-lg sm:text-2xl font-bold text-green-600">{formatPrice(invoicePreview.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">ℹ️ Step 4 Information</h4>
        <p className="text-xs sm:text-sm text-blue-800 mb-2">
          This is your final chance to review everything before publishing your course.
        </p>
        <ul className="text-xs sm:text-sm text-blue-800 list-disc list-inside space-y-1">
          <li>Course title, description, and metadata</li>
          <li>All chapters and their content</li>
          <li>Exercises and answers</li>
          <li>Final pricing and payment breakdown</li>
        </ul>
      </div>

      {/* Checklist */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-3">📋 Before Publishing</h4>
        <div className="space-y-2 text-sm text-yellow-800">
          <CheckItem done={!!courseData.title}>Course title is set</CheckItem>
          <CheckItem done={totalChapters > 0}>You have at least 1 chapter</CheckItem>
          <CheckItem done={totalExercises > 0}>You have at least 1 exercise</CheckItem>
          <CheckItem done={courseData.subscription_price > 0}>Price is set</CheckItem>
          <CheckItem done={!!courseData.objectives}>Objectives are defined</CheckItem>
        </div>
      </div>

      {/* Publish Action */}
      {onPublish && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold text-green-900 mb-3">✅ Ready to Publish?</h4>
          <p className="text-xs sm:text-sm text-green-800 mb-4">
            Once you publish this course, it will be available for students to enroll. You can still edit the course after publishing.
          </p>
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition text-sm sm:text-base"
          >
            {isPublishing ? '🔄 Publishing...' : '🚀 Publish Course Now'}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Summary Card Component
 */
const SummaryCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-2 sm:p-4 text-center">
    <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
    <p className="text-lg sm:text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs sm:text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

/**
 * Badge Component
 */
const Badge = ({ label, color }) => (
  <span className={`${color} text-white px-3 py-1 rounded-full text-sm`}>
    {label}
  </span>
);

/**
 * Chapter Review Card Component
 */
const ChapterReviewCard = ({ chapter, index, expanded, onToggle }) => (
  <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
    >
      <div className="text-left">
        <h4 className="font-semibold text-gray-900">
          Week {chapter.week_number || index}: {chapter.title}
        </h4>
        {chapter.subtitle && (
          <p className="text-sm text-gray-600 mt-1">{chapter.subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded">
          {chapter.exercises?.length || 0} exercises
        </span>
        <span className="text-xl text-gray-400">{expanded ? '▼' : '▶'}</span>
      </div>
    </button>

    {expanded && (
      <div className="px-6 py-4 border-t bg-white">
        {chapter.intro_message && (
          <div className="mb-4 pb-4 border-b">
            <h5 className="font-semibold text-sm mb-2">Introduction</h5>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {chapter.intro_message}
            </p>
          </div>
        )}

        <h5 className="font-semibold text-sm mb-3">Exercises ({chapter.exercises?.length || 0})</h5>
        <div className="space-y-2">
          {chapter.exercises && chapter.exercises.length > 0 ? (
            chapter.exercises.map((exercise, idx) => (
              <div key={exercise.id} className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="font-medium text-sm">{idx + 1}. {exercise.question}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Type: {exercise.type} | Points: {exercise.points}
                </p>
                {exercise.options && exercise.options.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {exercise.options.map((opt, optIdx) => (
                      <div key={optIdx} className="text-xs text-gray-600">
                        {opt.is_correct && '✓ '}{opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No exercises yet</p>
          )}
        </div>
      </div>
    )}
  </div>
);

/**
 * Check Item Component
 */
const CheckItem = ({ done, children }) => (
  <div className="flex items-center gap-2">
    <span className={`text-lg ${done ? '✓' : '○'}`}>{done ? '✓' : '○'}</span>
    <span className={done ? 'text-green-600 font-medium' : ''}>{children}</span>
  </div>
);

export default Step4Review;
