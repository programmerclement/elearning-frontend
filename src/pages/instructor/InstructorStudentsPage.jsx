import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useInstructorStudents } from '../../hooks/useApi';

export const InstructorStudentsPage = () => {
  const { data, isLoading, error } = useInstructorStudents();
  const [searchTerm, setSearchTerm] = useState('');

  const students = data?.data || [];

  // Filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentName = (student) => student.name || student.student_name || 'Unknown';
  const studentEmail = (student) => student.email || student.student_email || 'N/A';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error loading students: {error.message}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 My Students</h1>
          <p className="text-gray-600">View all students enrolled in your courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p className="text-gray-600 text-sm">Total Students</p>
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p className="text-gray-600 text-sm">Total Enrollments</p>
            <p className="text-3xl font-bold text-green-600">
              {students.reduce((sum, s) => sum + (s.course_count || 0), 0) || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <p className="text-gray-600 text-sm">Search Results</p>
            <p className="text-3xl font-bold text-purple-600">{filteredStudents.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Students Table */}
        {filteredStudents.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Courses</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Enrollment Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {studentName(student)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {studentEmail(student)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {student.course_titles ? student.course_titles.split(', ').map((course, idx) => (
                            <span key={idx} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course}
                            </span>
                          )) : (
                            <span className="text-gray-500">No courses</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No students match your search' : 'No students enrolled yet'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
