import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover object-center p-4"
        />
      </Link>
      <div className="p-4 flex flex-col justify-between h-40">
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.unit}</p>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md font-semibold transition-colors duration-300"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
