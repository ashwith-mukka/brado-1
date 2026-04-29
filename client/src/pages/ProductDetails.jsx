import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-green-600 mb-6 flex items-center gap-2 transition"
      >
        &larr; Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/2 p-8 flex justify-center items-center bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[500px] object-contain mix-blend-multiply"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-2">
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-500 text-lg mb-6">{product.unit}</p>

          <div className="flex items-center mb-8">
            <span className="text-4xl font-extrabold text-gray-900">₹{product.price}</span>
            <span className="ml-4 text-sm text-gray-500">(Inclusive of all taxes)</span>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4">
            {product.countInStock > 0 && (
              <select
                className="border p-4 rounded-lg font-semibold focus:ring-green-500 focus:border-green-500"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    Qty: {x + 1}
                  </option>
                ))}
              </select>
            )}
            <button 
              onClick={() => {
                addToCart(product, qty);
                toast.success('Added to cart!');
              }}
              disabled={product.countInStock === 0}
              className={`flex-1 font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${
                product.countInStock === 0 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
              }`}
            >
              Add to Cart
            </button>
          </div>
          
          {product.countInStock > 0 ? (
            <p className="mt-4 text-sm text-green-600 font-medium">✓ In Stock</p>
          ) : (
            <p className="mt-4 text-sm text-red-600 font-medium">✗ Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
