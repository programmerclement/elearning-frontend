import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useAllExercises } from '../../hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export const AdminExercisesPage = () => {
  const { data: coursesData } = useCourses();
  const { data: allExercisesData, isLoading: exercisesLoading, refetch: refetchExercises } = useAllExercises();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    chapter_id: '',
    question: '',
    type: 'radio',
    options: '[]',
    correct_answer: '',
    points: 1,
  });

  const courses = coursesData?.data || [];
  const allExercises = Array.isArray(allExercisesData) ? allExercisesData : [];

  // Get chapters for selected course
  const { data: chaptersData } = useQuery({
    queryKey: ['chapters', selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return { data: [] };
      const response = await apiClient.get(`/courses/${selectedCourseId}/chapters`);
      return response.data;
    },
    enabled: !!selectedCourseId,
  });

  const chapters = chaptersData?.data || [];

  // Filter exercises based on selected chapter (client-side)
  const filteredExercises = selectedChapterId
    ? allExercises.filter((ex) => ex.chapter_id === selectedChapterId)
    : selectedCourseId
    ? allExercises.filter((ex) => ex.course_id === selectedCourseId)
    : allExercises;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient.put(`/exercises/${editingId}`, formData);
      } else {
        await apiClient.post('/exercises', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ chapter_id: '', question: '', type: 'radio', options: '[]', correct_answer: '', points: 1 });
      refetchExercises();
    } catch (error) {
      alert('Error: ' + (error.message || 'Failed to save exercise'));
    }
  };

  const handleDelete = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await apiClient.delete(`/exercises/${exerciseId}`);
        refetchExercises();
      } catch (error) {
        alert('Error: ' + (error.message || 'Failed to delete exercise'));
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Exercises</h1>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Exercises</p>
            <p className="text-3xl font-bold text-blue-600">{filteredExercises.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-green-600">{courses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Chapters</p>
            <p className="text-3xl font-bold text-purple-600">{chapters.length}</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              value={selectedCourseId || ''}
              onChange={(e) => {
                setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null);
                setSelectedChapterId(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Chapter</label>
            <select
              value={selectedChapterId || ''}
              onChange={(e) => setSelectedChapterId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedCourseId}
            >
              <option value="">All Chapters</option>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ chapter_id: selectedChapterId || '', question: '', type: 'radio', options: '[]', correct_answer: '', points: 1 });
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add New Exercise'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                  <select
                    value={formData.chapter_id || ''}
                    onChange={(e) => setFormData({ ...formData, chapter_id: e.target.value ? parseInt(e.target.value) : '' })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a chapter</option>
                    {chapters.map((chapter) => (
                      <option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="radio">Multiple Choice</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                  <input
                    type="text"
                    value={formData.correct_answer}
                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Options (JSON)</label>
                <textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 font-mono"
                  placeholder='[{"label":"Option A","value":"a"},{"label":"Option B","value":"b"}]'
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingId ? 'Update Exercise' : 'Create Exercise'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {exercisesLoading ? (
            <div className="p-8 text-center text-gray-600">
              <p>Loading exercises...</p>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No exercises found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Chapter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExercises.map((exercise) => (
                    <tr key={exercise.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{exercise.course_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{exercise.chapter_title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{exercise.question}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{exercise.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{exercise.points}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(exercise.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
