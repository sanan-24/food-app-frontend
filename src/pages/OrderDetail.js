import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, reviewAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaClock, FaTruck, FaBox, FaStar } from 'react-icons/fa';

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [myReviews, setMyReviews] = useState([]);

  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data.order);
    } catch (error) {
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const res = await reviewAPI.getMyReviews();
      setMyReviews(res.data.reviews || []);
    } catch (err) {
      // ignore silently
    }
  };

  useEffect(() => {
    if (order) fetchMyReviews();
  }, [order]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.create({
        orderId: order._id,
        rating: Number(review.rating),
        comment: review.comment
      });
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReview({ rating: 5, comment: '' });
      fetchMyReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const getTrackingSteps = () => {
    const steps = [
      { status: 'Pending', icon: FaClock, label: 'Order Placed' },
      { status: 'Preparing', icon: FaBox, label: 'Preparing Food' },
      { status: 'Out for Delivery', icon: FaTruck, label: 'Out for Delivery' },
      { status: 'Delivered', icon: FaCheckCircle, label: 'Delivered' }
    ];

    const currentIndex = steps.findIndex(step => step.status === order?.orderStatus);
    return steps.map((step, index) => ({
      ...step,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) return null;

  const trackingSteps = getTrackingSteps();
  const myReview = myReviews.find(r => {
    const rid = r.order && r.order._id ? r.order._id : r.order;
    return String(rid) === String(order._id);
  });

  return (
    <div className="min-h-screen  bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="text-primary hover:underline mb-4"
          >
            ← Back to Orders
          </button>
          <h1 className="text-4xl font-bold">Order Details</h1>
          <p className="text-gray-600 mt-2">Order #{order._id.slice(-8)}</p>
        </div>

        {/* Order Tracking */}
        <div className="bg-gray-500 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8">Order Tracking</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(trackingSteps.filter(s => s.isActive).length - 1) * 33.33}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-4">
              {trackingSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                      step.isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${step.isCurrent ? 'ring-4 ring-primary ring-opacity-30' : ''}`}
                  >
                    <step.icon size={24} />
                  </div>
                  <p
                    className={`text-sm text-center font-medium ${
                      step.isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl font-semibold">
              Current Status: <span className="text-primary">{order.orderStatus}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-500 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-b">Order Items</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-6">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-900">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xl font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Section */}
            {order.orderStatus === 'Delivered' && (
              <div className="bg-gray-500 rounded-lg shadow-md p-8 mt-8">
                <h2 className="text-2xl font-bold mb-6">Leave a Review</h2>
                    {/* Show existing review for this order if present */}
                    {myReview ? (
                      <div className="mb-4">
                        <h3 className="font-semibold">Your Review</h3>
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < myReview.rating ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{myReview.rating} / 5</span>
                        </div>
                        <p className="mt-2">{myReview.comment}</p>
                      </div>
                    ) : !showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn-primary"
                  >
                    Write a Review
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        value={review.rating}
                        onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                        className="input-field"
                      >
                        {[5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>
                            {num} Star{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={review.comment}
                        onChange={(e) => setReview({ ...review, comment: e.target.value })}
                        required
                        rows="4"
                        className="input-field"
                        placeholder="Share your experience..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button type="submit" className="btn-primary">
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-500 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-900 mb-1">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-900 mb-1">Payment Method</p>
                  <p className="font-semibold">{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-900 mb-1">Delivery Address</p>
                  <p className="font-semibold">{order.shippingAddress.name}</p>
                  <p className="text-sm">{order.shippingAddress.phone}</p>
                  <p className="text-sm">
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
