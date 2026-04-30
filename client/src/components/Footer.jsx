import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-[0_-1px_10px_rgba(0,0,0,0.05)] h-12 md:h-14 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
          © 2026 Brado • Premium Quick Commerce
        </p>
        <div className="flex gap-4 md:gap-6">
          <Link to="/products" className="text-[10px] md:text-xs font-bold text-gray-600 hover:text-green-600 transition-colors uppercase tracking-widest">
            Privacy
          </Link>
          <Link to="/products" className="text-[10px] md:text-xs font-bold text-gray-600 hover:text-green-600 transition-colors uppercase tracking-widest">
            Terms
          </Link>
          <Link to="/products" className="text-[10px] md:text-xs font-bold text-gray-600 hover:text-green-600 transition-colors uppercase tracking-widest">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
