import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourses, useAllSyllabuses, useCreateSyllabus, useUpdateSyllabus, useDeleteSyllabus } from '../../hooks/useApi';

export const AdminSyllabusesPage = () => {
  const { data: coursesData } = useCourses();
  const { data: allSyllabusesData, isLoading: syllabusesLoading, refetch: refetchSyllabuses } = useAllSyllabuses();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', course_id: '' });

  const createSyllabusMutation = useCreateSyllabus();
  const updateSyllabusMutation = useUpdateSyllabus();
  const deleteSyllabusMutation = useDeleteSyllabus();

  const courses = coursesData?.data || [];
  const allSyllabuses = Array.isArray(allSyllabusesData) ? allSyllabusesData : [];

  // Filter syllabuses based on selected course (client-side)
  const filteredSyllabuses = selectedCourseId
    ? allSyllabuses.filter((syllabus) => syllabus.course_id === selectedCourseId)
    : allSyllabuses;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateSyllabusMutation.mutate(
        { syllabusId: editingId, syllabusData: formData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', description: '', course_id: '' });
            refetchSyllabuses();
          },
        }
      );
    } else {
      createSyllabusMutation.mutate(
        { course_id: selectedCourseId, ...formData },
        {
          onSuccess: () => {
            setShowForm(false);
            setFormData({ title: '', description: '', course_id: '' });
            refetchSyllabuses();
          },
        }
      );
    }
  };

  const handleEdit = (syllabus) => {
    setEditingId(syllabus.id);
    setFormData({ 
      title: syllabus.title, 
      description: syllabus.description,
      course_id: syllabus.course_id 
    });
    setShowForm(true);
  };

  const handleDelete = (syllabusId) => {
    if (window.confirm('Are you sure you want to delete this syllabus?')) {
      deleteSyllabusMutation.mutate(syllabusId, {
        onSuccess: () => {
          refetchSyllabuses();
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Manage Syllabuses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Syllabuses</p>
            <p className="text-3xl font-bold text-blue-600">{filteredSyllabuses.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-green-600">{courses.length}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
          <select
            value={selectedCourseId || ''}
            onChange={(e) => setSelectedCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ title: '', description: '', course_id: selectedCourseId || '' });
            }}
            disabled={!selectedCourseId}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {showForm ? 'Cancel' : 'Add New Syllabus'}
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
                {editingId ? 'Update Syllabus' : 'Create Syllabus'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {syllabusesLoading ? (
            <div className="p-8 text-center text-gray-600">
              <p>Loading syllabuses...</p>
            </div>
          ) : filteredSyllabuses.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No syllabuses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Outlines</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSyllabuses.map((syllabus) => {
                    const course = courses.find(c => c.id === syllabus.course_id);
                    return (
                      <tr key={syllabus.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{course?.title || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{syllabus.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{syllabus.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{syllabus.outline_count || 0} items</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(syllabus.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => handleEdit(syllabus)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(syllabus.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
