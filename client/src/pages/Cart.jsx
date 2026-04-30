import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <div className="py-12">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Bag</h1>
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
          {totalItems} Items
        </span>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't added anything to your bag yet.</p>
          <Link 
            to="/products" 
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.product} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50/50 transition-colors">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <Link to={`/products/${item.product}`} className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-400 font-medium mt-1">Unit Price: ₹{item.price}</p>
                      <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.product, Math.min(item.stock || 10, item.qty + 1))}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1 p-2 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-900">₹{(item.qty * item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-3xl p-8 sticky top-24 shadow-2xl shadow-gray-200 text-white">
              <h2 className="text-2xl font-black mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">₹{itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>Delivery</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-400 font-medium">Total Amount</p>
                    <p className="text-3xl font-black text-white">₹{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-green-900/20 active:scale-95"
              >
                Checkout Now
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                Taxes calculated at checkout. Secure SSL encrypted payment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

