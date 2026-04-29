import React from 'react';

const categories = [
  { name: 'Mobiles', icon: '📱' },
  { name: 'Laptops', icon: '💻' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Shoes', icon: '👟' },
  { name: 'Watches', icon: '⌚' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Grocery', icon: '🍎' },
  { name: 'Accessories', icon: '🎧' },
];

const CategorySection = ({ activeCategory, onSelectCategory }) => {
  return (
    <section className="py-8 bg-gray-50 overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-4 md:gap-8 justify-between">
        <button
          onClick={() => onSelectCategory('')}
          className={`flex flex-col items-center gap-2 group transition-all duration-300 ${
            activeCategory === '' ? 'scale-110' : 'opacity-70 hover:opacity-100'
          }`}
        >
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300 ${
            activeCategory === '' ? 'bg-green-600 text-white shadow-green-200 shadow-lg' : 'bg-white text-gray-600 hover:bg-green-50'
          }`}>
            🏠
          </div>
          <span className={`text-xs md:text-sm font-bold ${activeCategory === '' ? 'text-green-600' : 'text-gray-500'}`}>All</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex flex-col items-center gap-2 group transition-all duration-300 ${
              activeCategory === cat.name ? 'scale-110' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300 ${
              activeCategory === cat.name ? 'bg-green-600 text-white shadow-green-200 shadow-lg' : 'bg-white text-gray-600 hover:bg-green-50'
            }`}>
              {cat.icon}
            </div>
            <span className={`text-xs md:text-sm font-bold ${activeCategory === cat.name ? 'text-green-600' : 'text-gray-500'}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
