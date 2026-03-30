import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useCourseSyllabuses, useAddSyllabusOutline, useUpdateSyllabusOutline, useDeleteSyllabusOutline } from '../../hooks/useApi';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';

export const AdminSyllabusOutlinesPage = () => {
  const { data: coursesData } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState(null);
  const { data: syllabusesData } = useCourseSyllabuses(selectedCourseId);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const addOutlineMutation = useAddSyllabusOutline();
  const updateOutlineMutation = useUpdateSyllabusOutline();
  const deleteOutlineMutation = useDeleteSyllabusOutline();

  // Get outlines for selected syllabus
  const { data: outlinesData, refetch: refetchOutlines } = useQuery({
    queryKey: ['syllabus-outlines', selectedSyllabusId],
    queryFn: async () => {
      if (!selectedSyllabusId) return { data: [] };
      const response = await apiClient.get(`/syllabuses/${selectedSyllabusId}/outlines`);
      return response.data;
    },
    enabled: !!selectedSyllabusId,
  });

  const courses = coursesData?.data || [];
  const syllabuses = syllabusesData && Array.isArray(syllabusesData) ? syllabusesData : syllabusesData?.data || [];
  const outlines = outlinesData && Array.isArray(outlinesData) ? outlinesData : outlinesData?.data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);

    if (editingId) {
      updateOutlineMutation.mutate(
        { outlineId: editingId, outlineData: payload },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', description: '' });
            refetchOutlines();
          },
        }
      );
    } else {
      payload.append('syllabus_id', selectedSyllabusId);
      addOutlineMutation.mutate(
        { syllabusId: selectedSyllabusId, outlineData: payload },
        {
          onSuccess: () => {
            setShowForm(false);
            setFormData({ title: '', description: '' });
            refetchOutlines();
          },
        }
      );
    }
  };

  const handleEdit = (outline) => {
    setEditingId(outline.id);
    setFormData({ title: outline.title, description: outline.description });
    setShowForm(true);
  };

  const handleDelete = (outlineId) => {
    if (window.confirm('Are you sure you want to delete this outline?')) {
      deleteOutlineMutation.mutate(outlineId, {
        onSuccess: () => {
          refetchOutlines();
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Syllabus Outlines</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <select
              value={selectedCourseId || ''}
              onChange={(e) => {
                setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null);
                setSelectedSyllabusId(null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Syllabus</label>
            <select
              value={selectedSyllabusId || ''}
              onChange={(e) => setSelectedSyllabusId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedCourseId}
            >
              <option value="">Select a syllabus</option>
              {syllabuses.map((syllabus) => (
                <option key={syllabus.id} value={syllabus.id}>
                  {syllabus.title}
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
              setFormData({ title: '', description: '' });
            }}
            disabled={!selectedSyllabusId}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {showForm ? 'Cancel' : 'Add New Outline'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingId ? 'Update Outline' : 'Create Outline'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {outlines.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No outlines found for this syllabus</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {outlines.map((outline) => (
                    <tr key={outline.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{outline.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{outline.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(outline.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(outline)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(outline.id)}
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
