import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAdminDashboard } from '../../hooks/useApi';
import { couponAPI, courseAPI } from '../../api/apiService';

/**
 * Coupon Management Component
 */
const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    expires_at: '',
    is_active: 1,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponAPI.listCoupons();
      if (res.success) {
        setCoupons(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update coupon
        await couponAPI.updateCoupon(editingId, formData);
        alert('✅ Coupon updated successfully!');
      } else {
        // Create coupon
        await couponAPI.createCoupon(formData);
        alert('✅ Coupon created successfully!');
      }
      resetForm();
      fetchCoupons();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await couponAPI.deleteCoupon(couponId);
      alert('✅ Coupon deleted successfully!');
      fetchCoupons();
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_percentage: '',
      expires_at: '',
      is_active: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">🎟️ Coupon Management</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {showForm ? '✕ Cancel' : '+ New Coupon'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Coupon' : 'Create New Coupon'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Coupon Code (e.g., SAVE20)"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Discount %"
              value={formData.discount_percentage}
              onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="datetime-local"
              placeholder="Expires At"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center">
              <label className="mr-3 font-medium text-gray-700">Active</label>
              <input
                type="checkbox"
                checked={formData.is_active === 1}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {editingId ? 'Update Coupon' : 'Create Coupon'}
          </button>
        </div>
      )}

      {/* Coupons List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Code</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Discount %</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Expires At</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No coupons yet
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{coupon.code}</td>
                  <td className="px-4 py-3">{coupon.discount_percentage}%</td>
                  <td className="px-4 py-3">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      coupon.is_active && (coupon.expires_at ? new Date(coupon.expires_at) > new Date() : true)
                        ? 'bg-green-100 text-green-800'
                        : coupon.is_active && coupon.expires_at && new Date(coupon.expires_at) <= new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.is_active ? (coupon.expires_at && new Date(coupon.expires_at) <= new Date() ? 'Expired' : 'Active') : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Course Analytics Component
 */
const CourseAnalytics = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('enrollments');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseAPI.listCourses({ limit: 100 });
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedCourses = [...courses]
    .sort((a, b) => {
      if (sortBy === 'chapters') {
        return (b.total_chapters || 0) - (a.total_chapters || 0);
      } else if (sortBy === 'rating') {
        return (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0);
      }
      return (b.enrollment_count || 0) - (a.enrollment_count || 0);
    })
    .slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">📊 Course Analytics</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="enrollments">Top by Enrollments</option>
          <option value="chapters">Top by Chapters</option>
          <option value="rating">Top by Rating</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Course Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Instructor</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Chapters</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Exercises</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Enrollments</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Rating</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  Loading analytics...
                </td>
              </tr>
            ) : sortedCourses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  No courses found
                </td>
              </tr>
            ) : (
              sortedCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="font-semibold text-gray-900 max-w-xs truncate">
                        {course.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{course.instructor_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {course.total_chapters || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      {course.total_exercises || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-indigo-600">
                      {course.enrollment_count || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-yellow-600">
                      ⭐ {course.avg_rating ? Number(course.avg_rating).toFixed(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {course.status || 'draft'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminDashboard();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log('AdminDashboard loaded - isLoading:', isLoading, 'error:', error, 'data:', data);
  }, [isLoading, error, data]);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the entire platform and monitor system health.</p>
        </div>



        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading dashboard</p>
            <p>{error.message}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-4 py-2 font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'coupons'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                🎟️ Coupons
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 font-semibold border-b-2 whitespace-nowrap transition ${
                  activeTab === 'analytics'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                📈 Course Analytics
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
            {/* Primary Stats - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
                <p className="text-gray-700 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{data?.data?.users?.total || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
                <p className="text-gray-700 text-sm font-medium">Total Courses</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{data?.data?.courses?.total || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border border-purple-200">
                <p className="text-gray-700 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {(Number(data?.data?.revenue?.total_revenue) || 0).toFixed(2)} RWF
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow p-6 border border-orange-200">
                <p className="text-gray-700 text-sm font-medium">Transactions</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">{data?.data?.revenue?.total_transactions || 0}</p>
              </div>
            </div>

            {/* Secondary Stats - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow p-6 border border-indigo-200">
                <p className="text-gray-700 text-sm font-medium">Total Enrollments</p>
                <p className="text-4xl font-bold text-indigo-600 mt-2">{data?.data?.enrollments?.total || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg shadow p-6 border border-pink-200">
                <p className="text-gray-700 text-sm font-medium">Total Reviews</p>
                <p className="text-4xl font-bold text-pink-600 mt-2">{data?.data?.reviews?.total || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow p-6 border border-cyan-200">
                <p className="text-gray-700 text-sm font-medium">Total Exercises</p>
                <p className="text-4xl font-bold text-cyan-600 mt-2">{data?.data?.exercises?.total || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow p-6 border border-amber-200">
                <p className="text-gray-700 text-sm font-medium">Total Invoices</p>
                <p className="text-4xl font-bold text-amber-600 mt-2">{data?.data?.invoices?.total || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Role</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {data?.data?.users?.byRole?.student || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Instructors</span>
                    <span className="font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {data?.data?.users?.byRole?.instructor || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Admins</span>
                    <span className="font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {data?.data?.users?.byRole?.admin || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{data?.data?.courses?.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Published</span>
                    <span className="font-semibold bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      {data?.data?.courses?.published || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Draft</span>
                    <span className="font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                      {data?.data?.courses?.draft || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Total Chapters</span>
                    <span className="font-semibold">{data?.data?.totalChapters || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-green-600">
                      {(Number(data?.data?.revenue?.total_revenue) || 0).toFixed(2)} RWF
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Paid Orders</span>
                    <span className="font-semibold">{data?.data?.revenue?.paid_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Avg Transaction</span>
                    <span className="font-semibold">
                      {(
                        (Number(data?.data?.revenue?.total_transactions) || 0) > 0
                          ? Number(data?.data?.revenue?.total_revenue) / Number(data?.data?.revenue?.total_transactions)
                          : 0
                      ).toFixed(2)} RWF
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.recentUsers?.length > 0 ? (
                      data?.data?.recentUsers?.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
                                user.role === 'student'
                                  ? 'bg-blue-100 text-blue-700'
                                  : user.role === 'instructor'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-xs">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-500">
                          No recent users
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </>
)}

            {activeTab === 'coupons' && (
              <CouponManagement />
            )}

            {activeTab === 'analytics' && (
              <CourseAnalytics />
            )}
          </>
        )}

        {!isLoading && !error && !data && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No data available
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
