import React from 'react';

/**
 * Step 1: Basic Information
 * Collects: category, duration, hours/week, price, education level, target audience, objectives
 */
const Step1BasicInfo = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Business',
    'Design',
    'Other'
  ];

  const educationLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Course Information</h2>
      <p className="text-gray-600">Tell us about your course and who it's for</p>

      {/* Course Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Mastering React.js"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Course Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe what students will learn in this course"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>

      {/* Course Duration and Hours */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (weeks) *
          </label>
          <input
            type="number"
            name="duration_weeks"
            value={formData.duration_weeks}
            onChange={handleChange}
            min="1"
            max="52"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.duration_weeks ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 12"
          />
          {errors.duration_weeks && <p className="text-red-500 text-sm mt-1">{errors.duration_weeks}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Hours Per Week
          </label>
          <input
            type="number"
            name="required_hours_per_week"
            value={formData.required_hours_per_week}
            onChange={handleChange}
            min="1"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 5"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscription Price ($) *
          </label>
          <input
            type="number"
            name="subscription_price"
            value={formData.subscription_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.subscription_price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 49.99"
          />
          {errors.subscription_price && <p className="text-red-500 text-sm mt-1">{errors.subscription_price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Level *
          </label>
          <select
            name="education_level"
            value={formData.education_level}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.education_level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.education_level && <p className="text-red-500 text-sm mt-1">{errors.education_level}</p>}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Audience *
        </label>
        <textarea
          name="target_audience"
          value={formData.target_audience}
          onChange={handleChange}
          rows="2"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.target_audience ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Who is this course designed for? e.g., Developers with 2+ years experience"
        />
        {errors.target_audience && <p className="text-red-500 text-sm mt-1">{errors.target_audience}</p>}
      </div>

      {/* Course Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Objectives *
        </label>
        <textarea
          name="objectives"
          value={formData.objectives}
          onChange={handleChange}
          rows="3"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.objectives ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="What will students achieve? (One per line)&#10;- Build real-world applications&#10;- Master advanced concepts&#10;- Get certification"
        />
        {errors.objectives && <p className="text-red-500 text-sm mt-1">{errors.objectives}</p>}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Step 1 Information</h4>
        <p className="text-sm text-blue-800">
          These basic details define your course. You can update them later, but the title and pricing are especially important for student visibility.
        </p>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
