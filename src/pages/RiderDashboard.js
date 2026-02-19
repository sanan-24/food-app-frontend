import React, { useState, useEffect } from 'react';
import { orderAPI, userAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

const RiderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    inDelivery: 0
  });

  useEffect(() => {
    fetchRiderOrders();
  }, []);

  const fetchRiderOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getRiderOrders();
      const riderOrders = response.data.orders;
      setOrders(riderOrders);

      // Calculate stats
      const delivered = riderOrders.filter(o => o.orderStatus === 'Delivered').length;
      const inDelivery = riderOrders.filter(o => o.orderStatus === 'Out for Delivery').length;
      const pending = riderOrders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Preparing').length;

      setStats({
        total: riderOrders.length,
        delivered,
        inDelivery,
        pending
      });
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await orderAPI.updateDeliveryStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchRiderOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    } finally {
      setUpdating(null);
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
        <h1 className="text-4xl font-bold mb-2 text-primary animate-fade-up">🏍️ Rider Dashboard</h1>
        <p className="text-secondary font-semibold mb-8 animate-fade-up stagger-1">Manage your deliveries</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <p className="text-gray-400 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <p className="text-gray-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <p className="text-gray-400 mb-2">Out for Delivery</p>
            <p className="text-3xl font-bold text-primary">{stats.inDelivery}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <p className="text-gray-400 mb-2">Delivered</p>
            <p className="text-3xl font-bold text-green-400">{stats.delivered}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-300 text-lg">No orders assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-700">
                    <th className="py-3 px-4 text-left text-gray-200">Order ID</th>
                    <th className="py-3 px-4 text-left text-gray-200">Customer</th>
                    <th className="py-3 px-4 text-left text-gray-200">Address</th>
                    <th className="py-3 px-4 text-left text-gray-200">Phone</th>
                    <th className="py-3 px-4 text-left text-gray-200">Status</th>
                    <th className="py-3 px-4 text-left text-gray-200">Total</th>
                    <th className="py-3 px-4 text-left text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-700 text-gray-300">
                      <td className="py-4 px-4 font-semibold text-primary">#{order._id.slice(-8)}</td>
                      <td className="py-4 px-4">{order.user?.name}</td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span className="text-sm">{order.shippingAddress?.address}</span>
                      </td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <FaPhone className="text-secondary text-sm" />
                        {order.user?.phone}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${order.orderStatus === 'Pending' && 'bg-yellow-900 text-yellow-200'}
                          ${order.orderStatus === 'Preparing' && 'bg-orange-900 text-orange-200'}
                          ${order.orderStatus === 'Out for Delivery' && 'bg-primary bg-opacity-20 text-primary'}
                          ${order.orderStatus === 'Delivered' && 'bg-green-900 text-green-200'}
                          ${order.orderStatus === 'Cancelled' && 'bg-red-900 text-red-200'}
                        `}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">${order.totalPrice.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                          <div className="flex gap-2">
                            {order.orderStatus === 'Pending' && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'Preparing')}
                                disabled={updating === order._id}
                                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Preparing
                              </button>
                            )}
                            {(order.orderStatus === 'Preparing' || order.orderStatus === 'Pending') && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'Out for Delivery')}
                                disabled={updating === order._id}
                                className="bg-primary hover:bg-secondary disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Start Delivery
                              </button>
                            )}
                            {order.orderStatus === 'Out for Delivery' && (
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                disabled={updating === order._id}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition"
                              >
                                Delivered
                              </button>
                            )}
                          </div>
                        )}
                        {order.orderStatus === 'Delivered' && (
                          <span className="text-green-400 text-sm font-semibold">✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              order.orderStatus !== 'Delivered' && (
                <div key={order._id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-300">Customer: <span className="font-semibold">{order.user?.name}</span></p>
                    <p className="text-gray-300">Phone: <span className="font-semibold">{order.user?.phone}</span></p>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-300 text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Delivery Address:</h4>
                    <div className="text-gray-300 space-y-1">
                      <p>{order.shippingAddress?.name}</p>
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        {order.shippingAddress?.address}
                      </p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                      <p className="flex items-center gap-2 pt-2">
                        <FaPhone className="text-secondary" />
                        {order.shippingAddress?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDashboard;
