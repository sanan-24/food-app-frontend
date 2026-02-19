import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ isAdmin: false });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data.users || res.data);
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ isAdmin: !!user.isAdmin });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await userAPI.update(editingUser._id, formData);
      toast.success('User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await userAPI.delete(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-primary animate-fade-up">Manage Users</h1>
        <p className="text-secondary font-semibold mb-8 animate-fade-up stagger-1">Control user accounts and permissions</p>

        <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-200">Name</th>
                <th className="text-left py-3 px-4 text-gray-200">Email</th>
                <th className="text-left py-3 px-4 text-gray-200">Admin</th>
                <th className="text-left py-3 px-4 text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-700 hover:bg-gray-700 text-gray-300">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.isAdmin ? (
                    <span className="bg-green-900 text-green-200 px-3 py-1 rounded text-sm font-semibold">Yes</span>
                  ) : (
                    <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded text-sm">No</span>
                  )}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(u)} className="text-primary hover:text-secondary">
                        <FaEdit size={20} />
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  id="isAdmin"
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  className="accent-primary"
                />
                <label htmlFor="isAdmin" className="text-sm font-medium text-gray-200">Admin</label>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg">Update</button>
                <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
