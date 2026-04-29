import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold mb-4 md:mb-0">
          QuickCommerce
        </Link>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-lg w-full px-4 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for grocery, staples, etc."
              className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-green-600 bg-white border-l border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center space-x-6">
          <Link to="/products" className="text-white font-medium hover:text-green-200 transition">
            Products
          </Link>
          <Link to="/cart" className="relative text-white font-medium hover:text-green-200 transition flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
