import React, { useState } from 'react';
import { courseAPI } from '../../api/apiService';

export default function MultiStepCourseBuilder({ onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1
    title: '',
    subtitle: '',
    description: '',
    intro_message: '',

    // Step 2
    duration_weeks: '',
    required_hours_per_week: '',
    education_level: '',

    // Step 3
    target_audience: '',
    objectives: '',

    // Step 4
    category: '',
    level: 'beginner',
    language: 'English',
    price: '',
    subscription_price: '',
    thumbnail_url: '',
    attachments: [],

    // Metadata
    thumbnail_file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail_file: file,
        thumbnail_url: file.name,
      }));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Course title is required');
        return false;
      }
      if (!formData.subtitle.trim()) {
        setError('Subtitle is required');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.duration_weeks) {
        setError('Duration is required');
        return false;
      }
      if (!formData.education_level) {
        setError('Education level is required');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.objectives.trim()) {
        setError('Objectives are required');
        return false;
      }
    }
    if (step === 5) {
      if (!formData.category) {
        setError('Category is required');
        return false;
      }
      if (!formData.price) {
        setError('Price is required');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setLoading(true);
      const submitData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        intro_message: formData.intro_message,
        price: parseFloat(formData.price),
        subscription_price: parseFloat(formData.subscription_price) || 0,
        duration_weeks: parseInt(formData.duration_weeks),
        required_hours_per_week: parseInt(formData.required_hours_per_week),
        education_level: formData.education_level,
        target_audience: formData.target_audience,
        objectives: formData.objectives,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        thumbnail_url: formData.thumbnail_url,
        attachments: formData.attachments,
      };

      const response = await courseAPI.createCourse(submitData);
      if (response.success) {
        alert('Course created successfully!');
        setStep(1);
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          intro_message: '',
          duration_weeks: '',
          required_hours_per_week: '',
          education_level: '',
          target_audience: '',
          objectives: '',
          category: '',
          level: 'beginner',
          language: 'English',
          price: '',
          subscription_price: '',
          thumbnail_url: '',
          attachments: [],
          thumbnail_file: null,
        });
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Create New Course</h1>

        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded ${
                s <= step ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">Step {step} of 5</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 text-red-800 p-4 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Basic Course Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Node.js Backend Development"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subtitle *
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="e.g., Master backend development with Node.js"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Course description..."
                rows="4"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Intro Message
              </label>
              <input
                type="text"
                name="intro_message"
                value={formData.intro_message}
                onChange={handleInputChange}
                placeholder="Welcome message for students"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Duration & Level */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Duration & Level</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (Weeks) *
                </label>
                <input
                  type="number"
                  name="duration_weeks"
                  value={formData.duration_weeks}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hours Per Week *
                </label>
                <input
                  type="number"
                  name="required_hours_per_week"
                  value={formData.required_hours_per_week}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Education Level *
              </label>
              <select
                name="education_level"
                value={formData.education_level}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Audience & Objectives */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Audience & Objectives</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Target Audience
              </label>
              <input
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                placeholder="e.g., Developers with JavaScript basics"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Learning Objectives *
              </label>
              <textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                placeholder="What will students learn?"
                rows="4"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Pricing & Files */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pricing & Media</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  One-Time Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subscription Price ($)
                </label>
                <input
                  type="number"
                  name="subscription_price"
                  value={formData.subscription_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {formData.thumbnail_url && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ {formData.thumbnail_url}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Review Course Details</h2>
          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-semibold">{formData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subtitle</p>
                <p className="font-semibold">{formData.subtitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{formData.duration_weeks} weeks</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Education Level</p>
                <p className="font-semibold">{formData.education_level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-semibold">${formData.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subscription Price</p>
                <p className="font-semibold">${formData.subscription_price || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePreviousStep}
          disabled={step === 1}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={step === 5 ? handleSubmit : handleNextStep}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : step === 5 ? 'Create Course' : 'Next'}
        </button>
      </div>
    </div>
  );
}
