import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCourse, useCourseEnrollments, useCourseAllAttempts, useUpdateCourse, useCourseSyllabuses, useCreateSyllabus, useUpdateSyllabus, useDeleteSyllabus, useAddSyllabusOutline, useUpdateSyllabusOutline, useDeleteSyllabusOutline } from '../../hooks/useApi';
import { CourseFormModal } from '../../components/modals/CourseFormModal';

export const InstructorCourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tab') || 'overview';
  
  const { data: courseData, isLoading: courseLoading, refetch: refetchCourse } = useCourse(courseId);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useCourseEnrollments(courseId);
  const { data: attemptsData, isLoading: attemptsLoading } = useCourseAllAttempts(courseId);
  const { data: syllabusesData, refetch: refetchSyllabuses } = useCourseSyllabuses(courseId);
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutate: createSyllabus, isPending: isCreatingSyllabus } = useCreateSyllabus();
  const { mutate: updateSyllabus, isPending: isUpdatingSyllabus } = useUpdateSyllabus();
  const { mutate: deleteSyllabus, isPending: isDeletingSyllabus } = useDeleteSyllabus();
  const { mutate: addOutline, isPending: isAddingOutline } = useAddSyllabusOutline();
  const { mutate: updateOutline, isPending: isUpdatingOutline } = useUpdateSyllabusOutline();
  const { mutate: deleteOutline, isPending: isDeletingOutline } = useDeleteSyllabusOutline();
  
  const [activeTab, setActiveTab] = useState(tabParam);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNewSyllabus, setShowNewSyllabus] = useState(false);
  const [editingSyllabusId, setEditingSyllabusId] = useState(null);
  const [showAddOutline, setShowAddOutline] = useState(null);
  const [editingOutlineId, setEditingOutlineId] = useState(null);
  const [syllabusForm, setSyllabusForm] = useState({ title: '', description: '' });
  const [outlineForm, setOutlineForm] = useState({ title: '', description: '' });

  const course = courseData?.data;
  const enrollments = enrollmentsData?.data || [];
  const attempts = attemptsData?.data || [];
  const syllabuses = syllabusesData?.data || [];

  const handleUpdateCourse = (formData) => {
    updateCourse(
      { courseId, courseData: formData },
      {
        onSuccess: () => {
          setShowEditForm(false);
          refetchCourse();
        },
      }
    );
  };

  const handleCreateSyllabus = () => {
    createSyllabus(
      { course_id: parseInt(courseId), ...syllabusForm },
      {
        onSuccess: () => {
          setSyllabusForm({ title: '', description: '' });
          setShowNewSyllabus(false);
          refetchSyllabuses();
        },
      }
    );
  };

  const handleEditSyllabus = (syllabusId) => {
    const syllabus = syllabuses.find(s => s.id === syllabusId);
    if (syllabus) {
      setSyllabusForm({ title: syllabus.title, description: syllabus.description });
      setEditingSyllabusId(syllabusId);
    }
  };

  const handleSaveSyllabus = (syllabusId) => {
    updateSyllabus(
      { syllabusId, syllabusData: syllabusForm },
      {
        onSuccess: () => {
          setSyllabusForm({ title: '', description: '' });
          setEditingSyllabusId(null);
          refetchSyllabuses();
        },
      }
    );
  };

  const handleDeleteSyllabus = (syllabusId) => {
    if (window.confirm('Are you sure you want to delete this syllabus?')) {
      deleteSyllabus(syllabusId, {
        onSuccess: () => {
          refetchSyllabuses();
        },
      });
    }
  };

  const handleAddOutline = (syllabusId) => {
    if (!outlineForm.title) {
      alert('Outline title is required');
      return;
    }
    const formData = new FormData();
    formData.append('title', outlineForm.title);
    formData.append('description', outlineForm.description);
    
    addOutline(
      { syllabusId, formData },
      {
        onSuccess: () => {
          setOutlineForm({ title: '', description: '' });
          setShowAddOutline(null);
          refetchSyllabuses();
        },
      }
    );
  };

  const handleEditOutline = (outlineId, title, description) => {
    setOutlineForm({ title, description });
    setEditingOutlineId(outlineId);
  };

  const handleSaveOutline = (outlineId) => {
    if (!outlineForm.title) {
      alert('Outline title is required');
      return;
    }
    updateOutline(
      { outlineId, outlineData: outlineForm },
      {
        onSuccess: () => {
          setOutlineForm({ title: '', description: '' });
          setEditingOutlineId(null);
          refetchSyllabuses();
        },
      }
    );
  };

  const handleDeleteOutline = (outlineId) => {
    if (window.confirm('Are you sure you want to delete this outline?')) {
      deleteOutline(outlineId, {
        onSuccess: () => {
          refetchSyllabuses();
        },
      });
    }
  };

  if (courseLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <button
            onClick={() => navigate('/instructor/courses')}
            className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
          >
            ← Back to Courses
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Course not found
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        <button
          onClick={() => navigate('/instructor/courses')}
          className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
        >
          ← Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-9xl">📘</span>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{course.title}</h1>
                <p className="text-gray-600 text-lg mb-4">{course.description}</p>
              </div>
              <button
                onClick={() => setShowEditForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ✏️ Edit Course
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Price</p>
                <p className="text-2xl font-bold text-blue-600">${(Number(course.price) || 0).toFixed(2)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`text-lg font-semibold ${
                  course.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {course.status?.toUpperCase() || 'DRAFT'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Chapters</p>
                <p className="text-2xl font-bold text-purple-600">{(course.chapters || []).length}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Students</p>
                <p className="text-2xl font-bold text-orange-600">{enrollments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'students'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👥 Enrolled Students ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'exercises'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📝 Exercise Attempts ({attempts.length})
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📚 Syllabus ({syllabuses.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chapters */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Chapters</h2>
              {course.chapters && course.chapters.length > 0 ? (
                <div className="space-y-3">
                  {course.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{chapter.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            {chapter.exercises && (
                              <span>📋 {chapter.exercises.length} exercises</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No chapters added yet</p>
              )}
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Course Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Enrollments</p>
                  <p className="text-3xl font-bold text-blue-600">{enrollments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Exercise Attempts</p>
                  <p className="text-3xl font-bold text-purple-600">{attempts.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Student Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {attempts.length > 0
                      ? (
                          attempts.reduce((sum, att) => sum + (Number(att.marks) || 0), 0) /
                          attempts.length
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrolled Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Enrolled Students</h2>
            </div>
            {enrollmentsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : enrollments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Enrolled Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {enrollment.student_name || enrollment.user_name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {enrollment.student_email || enrollment.user_email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Enrolled
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {new Date(enrollment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No students enrolled yet</p>
              </div>
            )}
          </div>
        )}

        {/* Exercise Attempts Tab */}
        {activeTab === 'exercises' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Exercise Attempts</h2>
            </div>
            {attemptsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Exercise</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Chapter</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Marks Obtained</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total Marks</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Percentage</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attempts.map((attempt) => {
                      const score = Number(attempt.score) || 0;
                      const totalMarks = Number(attempt.points) || 1;
                      const percentage = totalMarks > 0 
                        ? ((score / totalMarks) * 100).toFixed(1)
                        : 0;
                      const isCorrect = attempt.is_correct;
                      
                      return (
                        <tr key={attempt.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {attempt.student_name || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {attempt.exercise_title || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {attempt.chapter_title || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              isCorrect === true ? 'bg-green-100 text-green-800' :
                              isCorrect === false ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {score.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                            {totalMarks.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              percentage >= 70
                                ? 'bg-green-100 text-green-800'
                                : percentage >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600">
                            {new Date(attempt.attempted_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No exercise attempts yet</p>
              </div>
            )}
          </div>
        )}

        {/* Syllabus Tab */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Syllabuses</h2>
                <button
                  onClick={() => {
                    setShowNewSyllabus(true);
                    setEditingSyllabusId(null);
                    setSyllabusForm({ title: '', description: '' });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  ➕ Add Syllabus
                </button>
              </div>

              {showNewSyllabus && (
                <div className="mb-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {editingSyllabusId ? 'Edit Syllabus' : 'Create New Syllabus'}
                  </h3>
                  <input
                    type="text"
                    placeholder="Syllabus Title"
                    value={syllabusForm.title}
                    onChange={(e) => setSyllabusForm({ ...syllabusForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={syllabusForm.description}
                    onChange={(e) => setSyllabusForm({ ...syllabusForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 text-sm"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (editingSyllabusId) {
                          handleSaveSyllabus(editingSyllabusId);
                        } else {
                          handleCreateSyllabus();
                        }
                      }}
                      disabled={(editingSyllabusId ? isUpdatingSyllabus : isCreatingSyllabus) || !syllabusForm.title}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                      {editingSyllabusId 
                        ? (isUpdatingSyllabus ? 'Updating...' : 'Update')
                        : (isCreatingSyllabus ? 'Creating...' : 'Create')
                      }
                    </button>
                    <button
                      onClick={() => {
                        setShowNewSyllabus(false);
                        setEditingSyllabusId(null);
                        setSyllabusForm({ title: '', description: '' });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {syllabuses.length > 0 ? (
                <div className="space-y-4">
                  {syllabuses.map((syllabus) => (
                    <div key={syllabus.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{syllabus.title}</h3>
                          <p className="text-sm text-gray-600">{syllabus.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSyllabus(syllabus.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSyllabus(syllabus.id)}
                            disabled={isDeletingSyllabus}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:bg-gray-400"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {syllabus.outlines && syllabus.outlines.length > 0 && (
                        <div className="mb-3 bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Outlines ({syllabus.outlines.length}):</p>
                          <div className="space-y-3">
                            {syllabus.outlines.map((outline, idx) => (
                              <div key={outline.id} className="bg-white p-2 rounded border border-gray-200 flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex gap-2 items-start">
                                    <span className="font-bold text-blue-600 text-xs">{idx + 1}.</span>
                                    <div className="flex-1">
                                      {editingOutlineId === outline.id ? (
                                        <div>
                                          <input
                                            type="text"
                                            placeholder="Outline Title"
                                            value={outlineForm.title}
                                            onChange={(e) => setOutlineForm({ ...outlineForm, title: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs mb-1"
                                          />
                                          <textarea
                                            placeholder="Description"
                                            value={outlineForm.description}
                                            onChange={(e) => setOutlineForm({ ...outlineForm, description: e.target.value })}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                            rows="2"
                                          />
                                        </div>
                                      ) : (
                                        <div>
                                          <p className="font-medium text-xs text-gray-800">{outline.title}</p>
                                          {outline.description && <p className="text-xs text-gray-600">{outline.description}</p>}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1 ml-2">
                                  {editingOutlineId === outline.id ? (
                                    <>
                                      <button
                                        onClick={() => handleSaveOutline(outline.id)}
                                        disabled={isUpdatingOutline || !outlineForm.title}
                                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition disabled:bg-gray-400"
                                      >
                                        ✓
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingOutlineId(null);
                                          setOutlineForm({ title: '', description: '' });
                                        }}
                                        className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition"
                                      >
                                        ✕
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleEditOutline(outline.id, outline.title, outline.description)}
                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() => handleDeleteOutline(outline.id)}
                                        disabled={isDeletingOutline}
                                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:bg-gray-400"
                                      >
                                        🗑️
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setShowAddOutline(showAddOutline === syllabus.id ? null : syllabus.id)}
                        className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition"
                      >
                        {showAddOutline === syllabus.id ? '✕ Cancel' : '➕ Add Outline'}
                      </button>

                      {showAddOutline === syllabus.id && (
                        <div className="mt-3 p-3 border border-purple-300 rounded-lg bg-purple-50">
                          <input
                            type="text"
                            placeholder="Outline Title"
                            value={outlineForm.title}
                            onChange={(e) => setOutlineForm({ ...outlineForm, title: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg mb-2 text-sm"
                          />
                          <textarea
                            placeholder="Outline Description (optional)"
                            value={outlineForm.description}
                            onChange={(e) => setOutlineForm({ ...outlineForm, description: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg mb-2 text-sm"
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddOutline(syllabus.id)}
                              disabled={isAddingOutline || !outlineForm.title}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                            >
                              {isAddingOutline ? 'Adding...' : 'Add'}
                            </button>
                            <button
                              onClick={() => {
                                setShowAddOutline(null);
                                setOutlineForm({ title: '', description: '' });
                              }}
                              className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No syllabuses created yet. Click "Add Syllabus" to get started!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Course Form Modal */}
      {showEditForm && (
        <CourseFormModal
          course={course}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleUpdateCourse}
          isLoading={isUpdating}
        />
      )}
    </DashboardLayout>
  );
};
