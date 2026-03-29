import { useState } from 'react';

export const ExerciseFormModal = ({ chapter, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    question: '',
    type: 'radio', // radio, checkbox, text
    options: '',
    correct_answer: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.question.trim()) newErrors.question = 'Question is required';
    if (['radio', 'checkbox'].includes(formData.type)) {
      if (!formData.options.trim()) {
        newErrors.options = 'Options are required (comma-separated)';
      }
      if (!formData.correct_answer.trim()) {
        newErrors.correct_answer = 'Correct answer is required';
      }
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const exerciseData = {
      question: formData.question,
      type: formData.type,
      options: ['radio', 'checkbox'].includes(formData.type)
        ? formData.options.split(',').map((opt) => opt.trim())
        : null,
      correct_answer: formData.correct_answer,
    };

    onSubmit(exerciseData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Chapter Info */}
        <div className="px-6 pt-6 pb-0">
          <p className="text-sm text-gray-600">
            Chapter: <span className="font-semibold text-gray-800">{chapter.title}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question *
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter the question text..."
              rows="2"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.question ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.question && (
              <p className="text-red-500 text-sm mt-1">{errors.question}</p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="radio">Multiple Choice (One Answer)</option>
              <option value="checkbox">Multiple Choice (Multiple Answers)</option>
              <option value="text">Short Answer (Text)</option>
            </select>
          </div>

          {/* Options (only for multiple choice) */}
          {['radio', 'checkbox'].includes(formData.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (comma-separated) *
              </label>
              <textarea
                name="options"
                value={formData.options}
                onChange={handleChange}
                placeholder="e.g., Option 1, Option 2, Option 3"
                rows="2"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.options ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.options && (
                <p className="text-red-500 text-sm mt-1">{errors.options}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: Separate each option with a comma
              </p>
            </div>
          )}

          {/* Correct Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer {['radio', 'checkbox'].includes(formData.type) ? '*' : '(Optional)'}
            </label>
            {['radio', 'checkbox'].includes(formData.type) ? (
              <>
                <input
                  type="text"
                  name="correct_answer"
                  value={formData.correct_answer}
                  onChange={handleChange}
                  placeholder="Enter the correct answer exactly as it appears in options"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.correct_answer ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.correct_answer && (
                  <p className="text-red-500 text-sm mt-1">{errors.correct_answer}</p>
                )}
              </>
            ) : (
              <textarea
                name="correct_answer"
                value={formData.correct_answer}
                onChange={handleChange}
                placeholder="Sample correct answer (if applicable)..."
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Preview */}
          {formData.question && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-900 mb-2">PREVIEW:</p>
              <p className="font-medium text-gray-800 text-sm mb-2">{formData.question}</p>
              {['radio', 'checkbox'].includes(formData.type) && formData.options && (
                <div className="space-y-1">
                  {formData.options.split(',').map((opt, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <input
                        type={formData.type === 'radio' ? 'radio' : 'checkbox'}
                        disabled
                        className="mr-2"
                      />
                      <span className="text-gray-700">{opt.trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400"
            >
              {isLoading ? 'Adding...' : 'Add Exercise'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
