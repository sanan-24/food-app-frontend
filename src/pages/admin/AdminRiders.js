import React, { useState, useEffect } from 'react';
import { riderAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      const res = await riderAPI.getAll();
      setRiders(res.data.riders || res.data);
    } catch (err) {
      toast.error('Failed to load riders');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await riderAPI.create(formData);
      toast.success('Rider created');
      setFormData({ name: '', email: '', phone: '', password: '' });
      setShowForm(false);
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create rider');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rider?')) return;
    try {
      await riderAPI.delete(id);
      toast.success('Rider deleted');
      fetchRiders();
    } catch (err) {
      toast.error('Failed to delete rider');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-primary animate-fade-up">Manage Riders</h1>
            <p className="text-secondary animate-fade-up stagger-1">Add and manage delivery riders</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2 animate-pop hover-pop">
            <FaPlus />
            <span>{showForm ? 'Close' : 'Add Rider'}</span>
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="input-field" required />
              <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="input-field" required />
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" className="input-field" />
              <input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password (optional)" className="input-field" />
              <div className="md:col-span-2 flex space-x-4 mt-2">
                <button type="submit" className="btn-primary">Create Rider</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-700 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-200">Name</th>
                <th className="text-left py-3 px-4 text-gray-200">Email</th>
                <th className="text-left py-3 px-4 text-gray-200">Phone</th>
                <th className="text-left py-3 px-4 text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {riders.map((r) => (
                <tr key={r._id} className="border-b border-gray-700 hover:bg-gray-700 text-gray-300">
                  <td className="py-3 px-4">{r.name}</td>
                  <td className="py-3 px-4">{r.email}</td>
                  <td className="py-3 px-4">{r.phone}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => navigator.clipboard.writeText(r.email)} className="text-blue-400 hover:text-blue-600">Copy Email</button>
                      <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRiders;
