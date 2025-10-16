import { useState } from 'react';
import Layout from '../components/Layout';
import { me } from '../lib/auth';

export default function ProfilePage() {
  const user = me();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    role: user?.role || 'user'
  });

  if (!user) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSave = () => {
    // In a real app, you'd save the profile data here
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? 'btn-secondary' : 'btn'}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Avatar */}
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-3xl">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isEditing && (
                  <button className="btn-secondary text-sm">
                    Change Avatar
                  </button>
                )}
              </div>

              {/* Profile Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                      {user.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                      {formData.firstName || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="input"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                      {formData.lastName || 'Not set'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800 capitalize">
                    {user.role}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications about orders and updates</p>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Enabled</span>
                </label>
              </div>

              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Get SMS alerts for urgent updates</p>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Disabled</span>
                </label>
              </div>

              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button className="btn-secondary text-sm">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200">
            <h2 className="text-xl font-semibold text-red-800 mb-6">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-800">Change Password</h3>
                  <p className="text-sm text-red-600">Update your account password</p>
                </div>
                <button className="btn-danger text-sm">
                  Change Password
                </button>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-800">Delete Account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <button className="btn-danger text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}