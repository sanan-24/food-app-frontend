import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryAPI.create(formData);
        toast.success('Category added successfully!');
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary animate-fade-up">Manage Categories</h1>
              <p className="text-secondary font-semibold mt-1 animate-fade-up stagger-1">Organize food categories</p>
            </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Category</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-200">Name</th>
                <th className="text-left py-3 px-4 text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-gray-700 hover:bg-gray-700 text-gray-300">
                  <td className="py-3 px-4">{category.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(category)} className="text-primary hover:text-secondary">
                        <FaEdit size={20} />
                      </button>
                      <button onClick={() => handleDelete(category._id)} className="text-red-500 hover:text-red-700">
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-200">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
