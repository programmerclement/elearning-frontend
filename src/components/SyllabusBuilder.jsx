import React, { useState, useEffect } from 'react';
import { syllabusAPI } from '../../api/apiService';

export default function SyllabusBuilder({ onSuccess }) {
  const [phase, setPhase] = useState('create'); // create, manage, addOutline
  const [syllabuses, setSyllabuses] = useState([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create syllabus form
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: '',
    subscription_price: '',
    education_level: '',
    target_audience: '',
    objectives: '',
    status: 'draft',
  });

  // Add outline form
  const [outlineForm, setOutlineForm] = useState({
    title: '',
    abstract: '',
    description: '',
    order_index: 0,
    thumbnail: null,
  });

  useEffect(() => {
    if (phase === 'manage') {
      fetchSyllabuses();
    }
  }, [phase]);

  const fetchSyllabuses = async () => {
    try {
      setLoading(true);
      const response = await syllabusAPI.listSyllabuses(1, 100);
      if (response.success) {
        setSyllabuses(response.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load syllabuses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSyllabus = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!createForm.title.trim()) {
        setError('Syllabus title is required');
        setLoading(false);
        return;
      }

      const submitData = {
        title: createForm.title,
        description: createForm.description,
        category: createForm.category,
        subscription_price:
          parseFloat(createForm.subscription_price) || 0,
        education_level: createForm.education_level,
        target_audience: createForm.target_audience,
        objectives: createForm.objectives,
        status: createForm.status,
      };

      const response = await syllabusAPI.createSyllabus(submitData);
      if (response.success) {
        alert('Syllabus created successfully!');
        setCreateForm({
          title: '',
          description: '',
          category: '',
          subscription_price: '',
          education_level: '',
          target_audience: '',
          objectives: '',
          status: 'draft',
        });
        setPhase('manage');
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to create syllabus');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSyllabus = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setPhase('addOutline');
    setOutlineForm({
      title: '',
      abstract: '',
      description: '',
      order_index: 0,
      thumbnail: null,
    });
  };

  const handleOutlineInputChange = (e) => {
    const { name, value } = e.target;
    setOutlineForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOutlineForm((prev) => ({
        ...prev,
        thumbnail: file,
      }));
    }
  };

  const handleAddOutline = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!outlineForm.title.trim()) {
        setError('Outline title is required');
        setLoading(false);
        return;
      }

      const response = await syllabusAPI.addOutline(
        selectedSyllabus.id,
        outlineForm
      );

      if (response.success) {
        alert('Outline added successfully!');
        setOutlineForm({
          title: '',
          abstract: '',
          description: '',
          order_index: 0,
          thumbnail: null,
        });
        // Refresh syllabuses
        fetchSyllabuses();
      }
    } catch (err) {
      setError(err.message || 'Failed to add outline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-8">Syllabus Manager</h1>

        {/* Phase Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setPhase('create')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              phase === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Create Syllabus
          </button>
          <button
            onClick={() => setPhase('manage')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              phase === 'manage'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Manage Syllabuses
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 text-red-800 p-4 rounded">
            {error}
          </div>
        )}

        {/* Create Phase */}
        {phase === 'create' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Create New Syllabus</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Syllabus Title *
              </label>
              <input
                type="text"
                name="title"
                value={createForm.title}
                onChange={handleCreateInputChange}
                placeholder="e.g., Full-Stack Development Bootcamp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={createForm.description}
                onChange={handleCreateInputChange}
                placeholder="Describe the syllabus..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={createForm.category}
                  onChange={handleCreateInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile Development">
                    Mobile Development
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  name="education_level"
                  value={createForm.education_level}
                  onChange={handleCreateInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subscription Price ($)
              </label>
              <input
                type="number"
                name="subscription_price"
                value={createForm.subscription_price}
                onChange={handleCreateInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                name="target_audience"
                value={createForm.target_audience}
                onChange={handleCreateInputChange}
                placeholder="Who should take this course?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives
              </label>
              <textarea
                name="objectives"
                value={createForm.objectives}
                onChange={handleCreateInputChange}
                placeholder="What will students learn?"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleCreateSyllabus}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Creating...' : 'Create Syllabus'}
            </button>
          </div>
        )}

        {/* Manage Phase */}
        {phase === 'manage' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Syllabuses</h2>

            {loading ? (
              <p className="text-center py-8">Loading syllabuses...</p>
            ) : syllabuses.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No syllabuses created yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {syllabuses.map((syllabus) => (
                  <div
                    key={syllabus.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-bold mb-2">{syllabus.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {syllabus.category}
                    </p>
                    <div className="space-y-2 mb-4 text-sm">
                      <p>
                        <span className="font-semibold">Price:</span> $
                        {syllabus.subscription_price}
                      </p>
                      <p>
                        <span className="font-semibold">Level:</span>{' '}
                        {syllabus.education_level}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs ${
                            syllabus.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {syllabus.status}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectSyllabus(syllabus)}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Outline
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Outline Phase */}
        {phase === 'addOutline' && selectedSyllabus && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setPhase('manage')}
                className="text-blue-600 hover:text-blue-700 text-sm mb-4"
              >
                ← Back to Syllabuses
              </button>
              <h2 className="text-2xl font-bold">
                Add Outline to "{selectedSyllabus.title}"
              </h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outline Title *
              </label>
              <input
                type="text"
                name="title"
                value={outlineForm.title}
                onChange={handleOutlineInputChange}
                placeholder="e.g., Frontend Fundamentals"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract
              </label>
              <input
                type="text"
                name="abstract"
                value={outlineForm.abstract}
                onChange={handleOutlineInputChange}
                placeholder="Brief overview"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={outlineForm.description}
                onChange={handleOutlineInputChange}
                placeholder="Detailed description"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  name="order_index"
                  value={outlineForm.order_index}
                  onChange={handleOutlineInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleAddOutline}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? 'Adding...' : 'Add Outline'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
