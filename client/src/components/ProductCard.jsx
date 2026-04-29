import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
        {product.rating && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-medium text-green-600 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <Link to={`/products/${product._id}`} className="block group-hover:text-green-600 transition-colors">
          <h3 className="text-gray-800 font-semibold text-lg line-clamp-1 mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Link
              to={`/products/${product._id}`}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
              title="View Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`p-2 rounded-xl transition-all duration-300 ${
                product.stock > 0
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title="Add to Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
