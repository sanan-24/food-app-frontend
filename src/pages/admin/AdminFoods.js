import React, { useState, useEffect } from 'react';
import { foodAPI, categoryAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaUtensils } from 'react-icons/fa';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    preparationTime: 30,
    isAvailable: true
  });

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await foodAPI.getAll();
      setFoods(response.data.foods);
    } catch (error) {
      toast.error('Failed to load foods');
    }
  };

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
      if (editingFood) {
        await foodAPI.update(editingFood._id, formData);
        toast.success('Food updated successfully!');
      } else {
        await foodAPI.create(formData);
        toast.success('Food added successfully!');
      }
      
      fetchFoods();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category._id || food.category,
      preparationTime: food.preparationTime,
      isAvailable: food.isAvailable
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodAPI.delete(id);
        toast.success('Food deleted successfully!');
        fetchFoods();
      } catch (error) {
        toast.error('Failed to delete food');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      preparationTime: 30,
      isAvailable: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary animate-fade-up">Manage Foods</h1>
            <p className="text-secondary font-semibold mt-1 animate-fade-up stagger-1">Add, edit, or remove food items</p>
          </div>
          <button
            onClick={() => {
              setEditingFood(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                image: '',
                category: '',
                preparationTime: 30,
                isAvailable: true
              });
              setShowModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Food</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto border border-gray-700">
          <table className="w-full min-w-full text-sm text-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-200 uppercase text-xs">Image</th>
                <th className="text-left py-3 px-4 text-gray-200 uppercase text-xs">Name</th>
                <th className="text-left py-3 px-4 text-gray-200 uppercase text-xs">Category</th>
                <th className="text-left py-3 px-4 text-gray-200 uppercase text-xs">Price</th>
                <th className="text-left py-3 px-4 text-gray-200 uppercase text-xs">Available</th>
                <th className="text-left py-3 px-4 text-gray-200 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <img src={food.image || 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60'} alt={food.name || 'Food item'} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="py-3 px-4 text-gray-100">{food.name}</td>
                  <td className="py-3 px-4 text-gray-200">{food.category?.name}</td>
                  <td className="py-3 px-4 text-gray-100">${food.price}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${food.isAvailable ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {food.isAvailable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(food)} className="bg-primary text-white p-1 rounded hover:opacity-90 flex items-center justify-center" title="Edit">
                        <FaEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(food._id)} className="bg-red-600 text-white p-1 rounded hover:opacity-90 flex items-center justify-center" title="Delete">
                        <FaTrash size={16} />
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
            <div className="bg-gray-800 text-gray-100 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">
                {editingFood ? 'Edit Food' : 'Add Food'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="3"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Prep Time (min)</label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="input-field"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Available</label>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    {editingFood ? 'Update' : 'Add'} Food
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-700 text-gray-200"
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

export default AdminFoods;
