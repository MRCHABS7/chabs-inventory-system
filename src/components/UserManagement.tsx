import { useState, useEffect } from 'react';
import { MultiTenantAuth } from '../lib/multi-tenant-auth';
import PermissionGuard from './PermissionGuard';
import type { TenantUser, UserRole } from '../lib/types-multi-tenant';

interface UserManagementProps {
  currentUser: TenantUser;
}

export default function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    roleId: ''
  });

  const auth = MultiTenantAuth.getInstance();
  const tenant = auth.getCurrentTenant();

  useEffect(() => {
    if (tenant) {
      loadUsers();
      loadRoles();
    }
  }, [tenant]);

  const loadUsers = () => {
    const stored = localStorage.getItem(`users_${tenant?.id}`);
    setUsers(stored ? JSON.parse(stored) : []);
  };

  const loadRoles = () => {
    const stored = localStorage.getItem(`roles_${tenant?.id}`);
    setRoles(stored ? JSON.parse(stored) : []);
  };

  const addUser = () => {
    if (!tenant || !newUser.email || !newUser.name || !newUser.roleId) return;

    // Check user limit
    if (!auth.checkUsageLimit(tenant, 'users', users.length)) {
      alert('User limit reached for your plan. Please upgrade to add more users.');
      return;
    }

    const role = roles.find(r => r.id === newUser.roleId);
    if (!role) return;

    const user: TenantUser = {
      id: `user_${Date.now()}`,
      tenantId: tenant.id,
      email: newUser.email,
      name: newUser.name,
      role,
      permissions: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem(`users_${tenant.id}`, JSON.stringify(updatedUsers));

    // Update tenant user count
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    const updatedTenants = tenants.map((t: any) => 
      t.id === tenant.id ? { ...t, currentUsers: updatedUsers.length } : t
    );
    localStorage.setItem('tenants', JSON.stringify(updatedTenants));

    setNewUser({ email: '', name: '', roleId: '' });
    setShowAddUser(false);
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem(`users_${tenant?.id}`, JSON.stringify(updatedUsers));
  };

  const updateUserRole = (userId: string, roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem(`users_${tenant?.id}`, JSON.stringify(updatedUsers));
  };

  if (!tenant) return null;

  return (
    <PermissionGuard resource="users" action="read" user={currentUser}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users and their permissions ({users.length}/{tenant.maxUsers === -1 ? '∞' : tenant.maxUsers} users)
            </p>
          </div>
          
          <PermissionGuard resource="users" action="create" user={currentUser}>
            <button
              onClick={() => setShowAddUser(true)}
              className="btn btn-primary"
              disabled={tenant.maxUsers !== -1 && users.length >= tenant.maxUsers}
            >
              Add User
            </button>
          </PermissionGuard>
        </div>

        {/* Usage Warning */}
        {tenant.maxUsers !== -1 && users.length >= tenant.maxUsers * 0.8 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h3 className="font-medium text-yellow-800">Approaching User Limit</h3>
                <p className="text-sm text-yellow-700">
                  You're using {users.length} of {tenant.maxUsers} available users. 
                  Consider upgrading your plan to add more users.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="input"
                    placeholder="User's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="input"
                    placeholder="user@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={newUser.roleId}
                    onChange={(e) => setNewUser(prev => ({ ...prev, roleId: e.target.value }))}
                    className="input"
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={addUser}
                  className="btn btn-primary flex-1"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td>
                      <PermissionGuard resource="users" action="update" user={currentUser} fallback={
                        <span className="text-sm">{user.role.name}</span>
                      }>
                        <select
                          value={user.role.id}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="input text-sm"
                          disabled={user.id === currentUser.id}
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                      </PermissionGuard>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <PermissionGuard resource="users" action="update" user={currentUser}>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          disabled={user.id === currentUser.id}
                          className={`btn text-sm px-3 py-1 ${
                            user.isActive ? 'btn-danger' : 'btn-success'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </PermissionGuard>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Role Permissions Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Role Permissions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map(role => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{role.name}</h4>
                  <span className="text-xs text-gray-500">
                    {users.filter(u => u.role.id === role.id).length} users
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="space-y-1">
                  {role.permissions.slice(0, 3).map((perm, idx) => (
                    <div key={idx} className="text-xs text-gray-500">
                      {perm.resource}: {perm.actions.join(', ')}
                    </div>
                  ))}
                  {role.permissions.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{role.permissions.length - 3} more permissions
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}