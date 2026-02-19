import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaStar, FaPlus } from 'react-icons/fa';

const FoodCard = ({ food }) => {
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(food);
    toast.success('Added to cart!');
  };

  const handleCardClick = () => {
    navigate(`/food/${food._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer food-card-hover border-t-4 border-primary animate-pop stagger-2 hover-pop"
      role="button"
      tabIndex={0}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60'}
          alt={food.name || 'Food item'}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 truncate text-white">{food.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{food.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <FaStar className="text-yellow-400" />
          <span className="ml-1 text-sm text-gray-400">
            {food.rating || 0} ({food.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price and Add Button */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">${food.price}</span>
          {food.isAvailable && (
            <button
              onClick={handleAddToCart}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
