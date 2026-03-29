import { useState } from 'react';
import './ExamModal.css';

const ExamModal = ({ chapter, exercises, onClose, onComplete, isLoading }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const currentExercise = exercises[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercises.length - 1;

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    exercises.forEach((exercise, index) => {
      const userAnswer = answers[index];
      if (exercise.type === 'text') {
        // For text, check if answer matches the correct answer
        if (userAnswer?.toLowerCase().trim() === exercise.correct_answer?.toLowerCase().trim()) {
          correctCount++;
        }
      } else if (exercise.type === 'radio' || exercise.type === 'checkbox') {
        // For single/multiple choice, check if selected option matches
        if (userAnswer === exercise.correct_answer) {
          correctCount++;
        }
      }
    });
    return Math.round((correctCount / exercises.length) * 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setResults({
      score,
      totalQuestions: exercises.length,
      correctAnswers: Math.round((score / 100) * exercises.length),
      passed: score >= 60,
    });
    setSubmitted(true);
  };

  if (!currentExercise && exercises.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8 text-center">
          <p className="text-gray-600">No exercises available for this chapter.</p>
          <button
            onClick={onClose}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className={`p-8 text-center ${results.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-6xl mb-4 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.passed ? '🎉' : '📚'}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <div className="text-center my-6">
              <p className="text-5xl font-bold text-gray-800">{results.score}%</p>
              <p className="text-gray-600 text-sm mt-2">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
            </div>
            <p className="text-gray-700 mb-6">
              {results.passed
                ? 'You have passed this chapter! Click Complete to proceed.'
                : 'You need 60% or more to pass. Please review and try again.'}
            </p>
            <div className="flex gap-3">
              {results.passed ? (
                <>
                  <button
                    onClick={() => onComplete()}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400"
                  >
                    {isLoading ? 'Completing...' : 'Complete Chapter'}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                      setSubmitted(false);
                      setResults(null);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Review
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                      setSubmitted(false);
                      setResults(null);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Retake Exam
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">{chapter.title}</h2>
          <p className="text-blue-100">Quiz Progress: {currentQuestionIndex + 1} of {exercises.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="px-6 py-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            {currentExercise.question || `Question ${currentQuestionIndex + 1}`}
          </h3>

          {/* Question Options */}
          <div className="space-y-3">
            {currentExercise.type === 'radio' && currentExercise.options && (
              <div className="space-y-3">
                {currentExercise.options.map((option, idx) => (
                  <label key={idx} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      checked={answers[currentQuestionIndex] === option}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentExercise.type === 'checkbox' && currentExercise.options && (
              <div className="space-y-3">
                {currentExercise.options.map((option, idx) => (
                  <label key={idx} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option}
                      checked={(answers[currentQuestionIndex] || []).includes(option)}
                      onChange={(e) => {
                        const selected = answers[currentQuestionIndex] || [];
                        if (e.target.checked) {
                          handleAnswerChange([...selected, option]);
                        } else {
                          handleAnswerChange(selected.filter((o) => o !== option));
                        }
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentExercise.type === 'text' && (
              <textarea
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>

        {/* Navigation and Submit */}
        <div className="px-6 py-6 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {exercises.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                  idx === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[idx]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
