
import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { CartItem } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  discount?: number;
  type: 'product';
}

interface ProductsSectionProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
  onAddToWishlist: (item: Omit<CartItem, 'quantity'>) => void;
}

const ProductsSection = ({ products, onAddToCart, onAddToWishlist }: ProductsSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Products</h2>
        <button className="text-purple-600 font-medium hover:text-purple-700">View All</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-purple-50 hover:shadow-md transition-all duration-200">
            <div className="relative mb-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-xl bg-gray-100"
              />
              {product.discount && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                  -{product.discount}%
                </span>
              )}
              <button
                onClick={() => onAddToWishlist(product)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-600" />
              </button>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <span className="text-white font-medium">Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-purple-600 font-medium">{product.category}</p>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">€{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">€{product.originalPrice}</span>
                  )}
                </div>
                <button 
                  onClick={() => onAddToCart(product)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    product.inStock 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
