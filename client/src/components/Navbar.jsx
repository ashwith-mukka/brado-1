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

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-xl font-bold">B</span>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Brodo
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-4 pr-12 text-sm focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-300"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/products" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors px-3 py-2 rounded-xl hover:bg-green-50">
              Explore
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
                <div className="hidden md:block text-right">
                  <p className="text-xs text-gray-400 font-medium">Hello,</p>
                  <p className="text-sm font-bold text-gray-900">{user.name.split(' ')[0]}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all duration-300 shadow-md shadow-gray-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

