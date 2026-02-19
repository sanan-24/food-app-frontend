import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodAPI } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaStar, FaMinus, FaPlus } from 'react-icons/fa';

const FoodDetail = () => {
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFood();
  }, [id]);

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await (await import('../utils/api')).then(m => m.reviewAPI.getByFood(id));
      setReviews(res.data.reviews || []);
    } catch (err) {
      // ignore
    }
  };

  const fetchFood = async () => {
    try {
      const response = await foodAPI.getById(id);
      setFood(response.data.food);
    } catch (error) {
      toast.error('Failed to load food details');
      navigate('/menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(food, quantity);
    toast.success(`${quantity} ${food.name} added to cart!`);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!food) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="relative h-96 md:h-auto">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              {!food.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">Not Available</span>
                </div>
              )}
            </div>
            {/* Details */}
            <div className="p-8">
              <div className="mb-4">
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {food.category?.name}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4 text-primary">{food.name}</h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(food.rating) ? '' : 'text-gray-600'} />
                  ))}
                </div>
                <span className="text-gray-400">
                  {food.rating} ({food.numReviews} reviews)
                </span>
              </div>

              <p className="text-gray-300 mb-6 text-lg">{food.description}</p>

              {/* Reviews list */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-400">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r._id} className="border border-gray-700 rounded p-4 bg-gray-700">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < r.rating ? '' : 'text-gray-600'} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 ml-2">by {r.user?.name || r.user?.email}</span>
                        </div>
                        <p className="mt-2 text-gray-700">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Preparation Time:</span> {food.preparationTime} minutes
                </p>
              </div>

              <div className="flex items-center mb-8">
                <span className="text-4xl font-bold text-primary">${food.price}</span>
              </div>

              {food.isAvailable && (
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-semibold">Quantity:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={decreaseQuantity}
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        <FaMinus />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button onClick={handleAddToCart} className="w-full btn-primary">
                    Add to Cart - ${(food.price * quantity).toFixed(2)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
