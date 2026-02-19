import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white animate-fade-up stagger-3">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">About FoodHub</h3>
            <p className="text-gray-400">
              Your favorite food delivery service. Fresh, fast, and delicious meals delivered right to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/menu" className="text-gray-400 hover:text-secondary transition font-semibold">
                  Menu
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-secondary transition font-semibold">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-secondary transition font-semibold">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl text-primary hover:text-secondary transition duration-300">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl text-primary hover:text-secondary transition duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl text-primary hover:text-secondary transition duration-300">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; 2024 FoodHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
