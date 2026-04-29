import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-6">Welcome to QuickCommerce</h1>
        
        {user ? (
          <div>
            <p className="text-xl text-gray-700 mb-4">Hello, {user.name}!</p>
            <p className="text-gray-500 mb-6">Email: {user.email}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/products')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Browse Products
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6">Please sign in to continue.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-md transition duration-300"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
