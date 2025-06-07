
import React from 'react';
import { Search, Filter, Plus, ShoppingCart } from 'lucide-react';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const SearchHeader = ({ searchQuery, setSearchQuery, cartItemCount, onCartClick }: SearchHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Shop & Services</h1>
          <p className="text-purple-100">Products and services for your clients</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onCartClick}
            className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-200" />
        <input
          type="text"
          placeholder="Search products and services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 border border-white/20 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Filter className="w-5 h-5 text-purple-200" />
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
