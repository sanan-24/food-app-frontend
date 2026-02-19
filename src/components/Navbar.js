import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaUtensils, FaMotorcycle } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isRider, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 border-b-4 border-primary animate-slide-down">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-primary hover:text-secondary transition hover-pop flex items-center">
            <FaUtensils className="mr-2" />
            <span>FoodHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-300 hover:text-primary transition">
              Home
            </Link>
            <Link to="/menu" className="text-gray-300 hover:text-primary transition">
              Menu
            </Link>
            {isAuthenticated && (
              <>
                {!isRider && (
                  <Link to="/orders" className="text-gray-300 hover:text-primary transition">
                    My Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="text-gray-300 hover:text-primary transition">
                    Admin Panel
                  </Link>
                )}
                {isRider && (
                    <Link to="/rider/dashboard" className="text-gray-300 hover:text-primary transition flex items-center">
                      <FaMotorcycle className="mr-2" />
                      <span>Deliveries</span>
                    </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart - only show for authenticated non-riders */}
            {isAuthenticated && !isRider && (
              <Link to="/cart" className="relative">
                <FaShoppingCart className="text-2xl text-gray-300 hover:text-primary transition" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-primary transition"
                >
                  <FaUser />
                  <span className="hidden md:inline">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-primary transition"
                >
                  <FaSignOutAlt />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
