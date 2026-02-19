import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gray-800 rounded-lg shadow-md p-12 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-white">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some delicious food to get started!</p>
            <Link to="/menu" className="btn-primary inline-block">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-primary">🛒 Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center border-b border-gray-700 p-6">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1 ml-6">
                    <h3 className="text-xl font-semibold mb-2 text-white">{item.name}</h3>
                    <p className="text-primary font-bold text-lg">${item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-primary text-white p-2 rounded-lg hover:bg-red-700 transition font-bold"
                    >
                      <FaMinus />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-secondary text-dark p-2 rounded-lg hover:bg-yellow-500 transition font-bold"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="ml-6 text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="p-6">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 transition font-semibold"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">$5.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${(getTotal() + 5).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button onClick={handleCheckout} className="w-full btn-primary mb-4">
                Proceed to Checkout
              </button>

              <Link
                to="/menu"
                className="block text-center text-primary hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
