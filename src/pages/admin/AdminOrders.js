import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, riderAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRider, setSelectedRider] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async () => {
    try {
      const response = await riderAPI.getAll();
      setRiders(response.data.riders || []);
    } catch (error) {
      console.error('Failed to load riders');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignRider = async () => {
    if (!selectedRider) {
      toast.error('Please select a rider');
      return;
    }

    try {
      await orderAPI.assignRider(selectedOrder._id, selectedRider);
      toast.success('Rider assigned successfully!');
      setShowAssignModal(false);
      setSelectedRider('');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to assign rider');
    }
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-900 text-yellow-200',
      'Preparing': 'bg-orange-900 text-orange-200',
      'Out for Delivery': 'bg-primary bg-opacity-20 text-primary',
      'Delivered': 'bg-green-900 text-green-200',
      'Cancelled': 'bg-red-900 text-red-200'
    };
    return colors[status] || 'bg-gray-700 text-gray-200';
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
        <h1 className="text-4xl font-bold mb-2 text-primary animate-fade-up">Manage Orders</h1>
        <p className="text-secondary font-semibold mb-8 animate-fade-up stagger-1">Track and manage all orders</p>

        <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto border border-gray-700 animate-fade-up stagger-2">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 px-4 text-gray-200">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-200">Customer</th>
                <th className="text-left py-3 px-4 text-gray-200">Items</th>
                <th className="text-left py-3 px-4 text-gray-200">Total</th>
                <th className="text-left py-3 px-4 text-gray-200">Status</th>
                <th className="text-left py-3 px-4 text-gray-200">Assigned Rider</th>
                <th className="text-left py-3 px-4 text-gray-200">Date</th>
                <th className="text-left py-3 px-4 text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-700 text-gray-300">
                  <td className="py-3 px-4 font-semibold text-primary">#{order._id.slice(-8)}</td>
                  <td className="py-3 px-4">{order.user?.name}</td>
                  <td className="py-3 px-4">{order.orderItems.length} items</td>
                  <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`px-3 py-1 rounded text-sm font-semibold border-0 focus:ring-2 focus:ring-primary cursor-pointer ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {order.assignedTo ? (
                      <span className="bg-green-900 text-green-200 px-3 py-1 rounded text-sm font-semibold">
                        {order.assignedTo.name || 'Assigned'}
                      </span>
                    ) : (
                      <button
                        onClick={() => openAssignModal(order)}
                        className="bg-primary hover:bg-secondary text-white px-3 py-1 rounded text-sm font-semibold transition"
                      >
                        Assign Rider
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-primary hover:text-secondary transition"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Rider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Assign Rider</h2>
            <p className="text-gray-300 mb-4">Order: <span className="font-semibold">#{selectedOrder?._id.slice(-8)}</span></p>

            {riders.length === 0 ? (
              <p className="text-gray-300 py-4">No riders available. Please create a rider first.</p>
            ) : (
              <div className="mb-6">
                <label className="block text-gray-200 mb-2 font-semibold">Select Rider:</label>
                <select
                  value={selectedRider}
                  onChange={(e) => setSelectedRider(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-primary focus:outline-none"
                >
                  <option value="">Choose a rider...</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name} ({rider.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRider('');
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition"
              >
                Cancel
              </button>
              {riders.length > 0 && (
                <button
                  onClick={handleAssignRider}
                  className="flex-1 bg-primary hover:bg-secondary text-white px-4 py-2 rounded font-semibold transition"
                >
                  Assign
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
