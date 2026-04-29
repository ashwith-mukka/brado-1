import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
          <Link to="/products" className="text-green-600 font-semibold hover:text-green-700">
            Go Back
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.product} className="flex flex-col sm:flex-row items-center p-6 gap-6">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/products/${item.product}`} className="text-lg font-semibold text-gray-800 hover:text-green-600">
                      {item.name}
                    </Link>
                    <p className="text-gray-500 font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      className="p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                      value={item.qty}
                      onChange={(e) => updateQuantity(item.product, e.target.value)}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-2 rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Items ({totalItems})</span>
                <span className="font-semibold text-gray-800">₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-green-600">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
