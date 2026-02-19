import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, userAPI, foodAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { FaUsers, FaUtensils, FaShoppingBag, FaDollarSign } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalFoods: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, usersRes, foodsRes] = await Promise.all([
        orderAPI.getAll(),
        userAPI.getAll(),
        foodAPI.getAll()
      ]);

      const orders = ordersRes.data.orders;
      const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        totalUsers: usersRes.data.count,
        totalFoods: foodsRes.data.count,
        totalRevenue: revenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-primary animate-fade-up">Admin Dashboard</h1>
        <p className="text-secondary font-semibold mb-8 animate-fade-up stagger-1">Manage your food delivery service</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <div className="bg-primary bg-opacity-20 p-4 rounded-lg">
                <FaShoppingBag className="text-primary text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-secondary bg-opacity-20 p-4 rounded-lg">
                <FaUsers className="text-secondary text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Total Foods</p>
                <p className="text-3xl font-bold text-white">{stats.totalFoods}</p>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 p-4 rounded-lg">
                <FaUtensils className="text-yellow-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg">
                <FaDollarSign className="text-green-400 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Link
              to="/admin/foods"
              className="bg-primary text-white p-4 rounded-lg hover:bg-secondary transition text-center text-lg font-semibold"
            >
              Foods
            </Link>
            <Link
              to="/admin/categories"
               className="bg-primary text-white p-4 rounded-lg hover:bg-secondary transition text-center text-lg font-semibold"
            >
            Categories
            </Link>
            <Link
              to="/admin/orders"
               className="bg-primary text-white p-4 rounded-lg hover:bg-secondary transition text-center text-lg font-semibold"
            >
              Orders
            </Link>
            <Link
              to="/admin/users"
               className="bg-primary text-white p-4 rounded-lg hover:bg-secondary transition text-center text-lg font-semibold"
            >
            Users
            </Link>
            <Link
              to="/admin/riders"
              className="bg-primary text-white p-4 rounded-lg hover:bg-secondary transition text-center text-lg font-semibold"
            >
              Riders
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-200">Order ID</th>
                  <th className="text-left py-3 px-4 text-gray-200">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-200">Status</th>
                  <th className="text-left py-3 px-4 text-gray-200">Total</th>
                  <th className="text-left py-3 px-4 text-gray-200">Date</th>
                  <th className="text-left py-3 px-4 text-gray-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-700 text-gray-300">
                    <td className="py-3 px-4">#{order._id.slice(-8)}</td>
                    <td className="py-3 px-4">{order.user?.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full text-sm bg-orange-900 text-orange-200">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-primary hover:text-secondary transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
