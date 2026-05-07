import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const query = useQuery();
  const keyword = query.get('keyword') || '';
  const categoryFilter = query.get('category') || '';
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('products/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'products?';
        if (keyword) url += `keyword=${keyword}&`;
        if (categoryFilter) url += `category=${categoryFilter}&`;
        
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, categoryFilter]);

  const handleCategoryClick = (catName) => {
    if (catName === categoryFilter) {
      navigate('/products'); // clear filter
    } else {
      navigate(`/products?category=${catName}`);
    }
  };

  return (
    <div className="px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar for Categories */}
      <div className="w-full md:w-1/4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Categories</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/products')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  !categoryFilter ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat, index) => (
              <li key={index}>
                <button
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    categoryFilter === cat.name
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full md:w-3/4">
        {keyword && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search Results for "{keyword}"
          </h2>
        )}
        {!keyword && categoryFilter && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {categoryFilter}
          </h2>
        )}
        {!keyword && !categoryFilter && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl text-gray-600">No products found.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
