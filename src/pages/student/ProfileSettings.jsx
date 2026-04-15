import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProfile, useUpdateProfile } from '../../hooks/useApi';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data: userProfileData, isLoading: profileLoading, refetch } = useGetProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDeactivate, setShowConfirmDeactivate] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    role: '',
    avatar: '',
    userType: 'learner',
    skills: '',
    notifications: {
      email: true,
      messages: false,
    },
  });

  useEffect(() => {
    if (userProfileData?.data) {
      const user = userProfileData.data;
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        role: user.role || '',
        avatar: user.avatar || '',
        skills: user.skills || '',
      }));
      if (user.avatar) {
        setPreview(user.avatar);
      }
    }
  }, [userProfileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    const updateData = {
      name: formData.name,
      bio: formData.bio,
      phone: formData.phone,
      location: formData.location,
      avatar: formData.avatar,
      skills: formData.skills,
      notifications: formData.notifications,
    };

    updateProfile(
      updateData,
      {
        onSuccess: (response) => {
          setSuccess('Profile updated successfully!');
          setTimeout(() => setSuccess(false), 3000);
          refetch();
          if (response?.data) {
            updateUser(response.data);
          }
        },
        onError: (err) => {
          setError(err.response?.data?.message || 'Failed to update profile');
        },
      }
    );
  };

  const handlePasswordReset = async () => {
    try {
      setError(null);
      setIsResettingPassword(true);
      const response = await apiClient.post('/auth/request-password-reset', {
        email: formData.email,
      });
      setPasswordResetSent(true);
      setSuccess('Password reset link sent to your email!');
      setTimeout(() => {
        setPasswordResetSent(false);
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setError(null);
      setIsEnabling2FA(true);
      const response = await apiClient.post('/auth/enable-2fa', {
        userId: userId,
      });
      setTwoFAEnabled(true);
      setSuccess('Two-factor authentication enabled successfully!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setError(null);
      setIsEnabling2FA(true);
      await apiClient.post('/auth/disable-2fa', {
        userId: userId,
      });
      setTwoFAEnabled(false);
      setSuccess('Two-factor authentication disabled');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setError(null);
      setIsDeactivating(true);
      await apiClient.post('/auth/deactivate-account', {
        userId: userId,
      });
      setSuccess('Account deactivation initiated. You will be logged out.');
      setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate account');
      setIsDeactivating(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) {
      setError('No text to copy');
      return;
    }
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(false), 2000);
  };

  if (profileLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
        {/* Header Section */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{formData.name || 'User'}</h1>
                  <p className="text-purple-600 font-semibold">{formData.role || 'Learner'}</p>
                  <p className="text-gray-600 text-sm">{formData.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
              >
                Back
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'overview'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'activity'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity Logs
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Alert Messages */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center animate-in">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 font-bold">✕</button>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex justify-between items-center animate-in">
              <span>{success}</span>
              <button onClick={() => setSuccess(false)} className="text-green-700 hover:text-green-900 font-bold">✕</button>
            </div>
          )}

          {activeTab === 'overview' && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Information Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Profile Information</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Profile Photo
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-purple-200">
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="avatar"
                          className="cursor-pointer block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Change Photo
                        </label>
                        <p className="text-xs text-gray-600 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                      </div>
                    </div>
                  </div>

                  <hr className="my-6" />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    {/* Telephone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telephone
                      </label>
                      <div className="flex">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 000-0000"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(formData.phone)}
                          className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition"
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* E-mail */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        E-mail
                      </label>
                      <div className="flex">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg bg-gray-100 text-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(formData.email)}
                          className="px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition"
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={formData.role || 'Learner'}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>



                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio / About
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                      maxLength="500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.bio.length || 0}/500 characters</p>
                  </div>

                  {/* Send Notification To */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Send Notification To
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.email}
                          onChange={() => handleNotificationChange('email')}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="ml-3 text-gray-700">📧 Email</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.messages}
                          onChange={() => handleNotificationChange('messages')}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                        />
                        <span className="ml-3 text-gray-700">💬 Message (Platform)</span>
                      </label>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Skills / Expertise
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., Web Development, Data Science, UX Design"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isUpdating && <span className="animate-spin">⏳</span>}
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Security & Privacy Section */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Security & Privacy</h2>
                  <span className="text-2xl">🔒</span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Password Section */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Password Management</h3>
                    <div className="relative mb-3">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value="••••••••••"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 text-lg"
                      >
                        {showPassword ? '👁️' : '🙈'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={passwordResetSent || isResettingPassword}
                      className={`px-4 py-2 border rounded-lg font-semibold transition flex items-center gap-2 ${
                        passwordResetSent
                          ? 'border-green-600 text-green-600 bg-green-50'
                          : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                      } disabled:opacity-50`}
                    >
                      {isResettingPassword && <span className="animate-spin">⏳</span>}
                      {passwordResetSent ? '✓ Link Sent to Email' : 'Send Reset Link'}
                    </button>
                  </div>

                  <hr />

                  {/* Secure Your Account */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-1">🔐</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Add an extra layer of security. You'll need a 6-digit code from your authenticator app to log in.
                        </p>
                        {twoFAEnabled && (
                          <p className="text-sm text-green-600 mt-2 font-semibold">✓ Enabled</p>
                        )}
                        <button
                          type="button"
                          onClick={twoFAEnabled ? handleDisable2FA : handleEnable2FA}
                          disabled={isEnabling2FA}
                          className={`mt-3 px-4 py-2 rounded-lg font-semibold text-white transition disabled:opacity-50 flex items-center gap-2 ${
                            twoFAEnabled
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-purple-600 hover:bg-purple-700'
                          }`}
                        >
                          {isEnabling2FA && <span className="animate-spin">⏳</span>}
                          {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Account Privacy */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Account Privacy</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-1">⚠️</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Account Deactivation</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Deactivating your account will:
                          </p>
                          <ul className="text-sm text-gray-600 mt-2 ml-4 list-disc space-y-1">
                            <li>Permanently delete all your data</li>
                            <li>Unenroll you from all courses</li>
                            <li>Remove your profile permanently</li>
                            <li>This action cannot be undone</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Deactivate Account */}
                    <button
                      type="button"
                      onClick={() => setShowConfirmDeactivate(!showConfirmDeactivate)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                      Deactivate Account
                    </button>

                    {showConfirmDeactivate && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-semibold mb-3">
                          ⚠️ FINAL WARNING: This action cannot be undone!
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowConfirmDeactivate(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeactivateAccount}
                            disabled={isDeactivating}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center gap-2"
                          >
                            {isDeactivating && <span className="animate-spin">⏳</span>}
                            {isDeactivating ? 'Deactivating...' : 'Yes, Deactivate My Account'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg">📋 Activity logs coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettings;
