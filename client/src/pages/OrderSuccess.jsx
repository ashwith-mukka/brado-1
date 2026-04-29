import React, { useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const OrderSuccess = () => {
  const { id } = useParams();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Successful!</h1>
        <p className="text-gray-500 font-medium mb-8">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-left">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Order ID</p>
          <p className="text-sm font-mono text-gray-900 break-all">{id}</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/my-orders" 
            className="block w-full text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
