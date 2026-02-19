import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI, categoryAPI } from '../utils/api';
import FoodCard from '../components/FoodCard';
import { FaPizzaSlice, FaUtensils, FaShippingFast, FaCreditCard } from 'react-icons/fa';
import { GiFrenchFries } from 'react-icons/gi';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pizzaFoods, setPizzaFoods] = useState([]);
  const [burgerFoods, setBurgerFoods] = useState([]);
  const [shawarmaFoods, setShawarmaFoods] = useState([]);
  const [friesFoods, setFriesFoods] = useState([]);
  const [otherFoods, setOtherFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodsRes, categoriesRes] = await Promise.all([
        foodAPI.getAll(),
        categoryAPI.getAll()
      ]);

      const allFoods = foodsRes.data.foods;
      setFeaturedFoods(allFoods.slice(0, 6));
      setCategories(categoriesRes.data.categories);

      // Filter foods by category
      const pizza = allFoods.filter((food) => food.category?.name?.toLowerCase().includes('pizza')).slice(0, 6);
      const burger = allFoods.filter((food) => food.category?.name?.toLowerCase().includes('burger')).slice(0, 6);
      const shawarma = allFoods.filter((food) => food.category?.name?.toLowerCase().includes('shawarma')).slice(0, 6);
      const fries = allFoods.filter((food) => food.category?.name?.toLowerCase().includes('fries')).slice(0, 6);
      
      // Other items - anything that doesn't fit the above categories
      const other = allFoods.filter((food) => 
        !food.category?.name?.toLowerCase().includes('pizza') &&
        !food.category?.name?.toLowerCase().includes('burger') &&
        !food.category?.name?.toLowerCase().includes('shawarma') &&
        !food.category?.name?.toLowerCase().includes('fries')
      ).slice(0, 6);

      setPizzaFoods(pizza);
      setBurgerFoods(burger);
      setShawarmaFoods(shawarma);
      setFriesFoods(fries);
      setOtherFoods(other);
    } catch (error) {
      toast.error('Failed to load data');
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

  const FoodSection = ({ title, icon, foods, categoryName }) => (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white">
            {icon} {title}
          </h2>
          {foods.length > 0 && (
            <Link
              to={`/menu?search=${categoryName}`}
              className="text-primary hover:text-secondary transition font-semibold"
            >
              View All →
            </Link>
          )}
        </div>
        {foods.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No items available in this category</p>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-up stagger-1">
            Delicious Food, Delivered Fast! <FaUtensils className="inline-block ml-2 text-primary" />
          </h1>
          <p className="text-xl mb-8 font-semibold animate-fade-up stagger-2">
            Order your favorite meals from the best restaurants
          </p>
          <Link
            to="/menu"
            className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block text-lg shadow-lg animate-pop hover-pop"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/menu?category=${category._id}`}
                className="bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-xl hover:bg-gray-700 transition border border-gray-700"
              >
                <div className="text-4xl mb-3">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="mx-auto h-12 w-12 object-cover rounded" />
                  ) : (
                    <FaUtensils className="mx-auto text-4xl" />
                  )}
                </div>
                <h3 className="font-semibold text-lg text-gray-100">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="btn-primary inline-block"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Pizza Section */}
      <FoodSection 
        title="Pizza Specials" 
        icon={<FaPizzaSlice className="inline-block mr-2 text-primary" />} 
        foods={pizzaFoods}
        categoryName="pizza"
      />

      {/* Burger Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">
              <FaUtensils className="inline-block mr-2 text-primary" /> Delicious Burgers
            </h2>
            {burgerFoods.length > 0 && (
              <Link
                to="/menu?search=burger"
                className="text-primary hover:text-secondary transition font-semibold"
              >
                View All →
              </Link>
            )}
          </div>
          {burgerFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {burgerFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No burgers available</p>
            </div>
          )}
        </div>
      </section>

      {/* Shawarma Section */}
      <FoodSection 
        title="Shawarma Delights" 
        icon={<FaUtensils className="inline-block mr-2 text-primary" />} 
        foods={shawarmaFoods}
        categoryName="shawarma"
      />

      {/* Fries Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">
              <GiFrenchFries className="inline-block mr-2 text-primary" /> Crispy Fries
            </h2>
            {friesFoods.length > 0 && (
              <Link
                to="/menu?search=fries"
                className="text-primary hover:text-secondary transition font-semibold"
              >
                View All →
              </Link>
            )}
          </div>
          {friesFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {friesFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No fries available</p>
            </div>
          )}
        </div>
      </section>

      {/* Other Items Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-white">
              <FaUtensils className="inline-block mr-2 text-primary" /> Other Specialties
            </h2>
            {otherFoods.length > 0 && (
              <Link
                to="/menu"
                className="text-primary hover:text-secondary transition font-semibold"
              >
                View All →
              </Link>
            )}
          </div>
          {otherFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No other items available</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4"><FaShippingFast className="mx-auto" /></div>
              <h3 className="text-xl font-semibold mb-2 text-white">Fast Delivery</h3>
              <p className="text-gray-400">Get your food delivered in 30 minutes or less</p>
            </div>
            <div className="text-center">
                <div className="text-5xl mb-4"><FaUtensils className="mx-auto" /></div>
              <h3 className="text-xl font-semibold mb-2 text-white">Fresh Food</h3>
              <p className="text-gray-400">All meals are prepared fresh with quality ingredients</p>
            </div>
            <div className="text-center">
                <div className="text-5xl mb-4"><FaCreditCard className="mx-auto" /></div>
              <h3 className="text-xl font-semibold mb-2 text-white">Easy Payment</h3>
              <p className="text-gray-400">Multiple payment options available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
