
import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Filter, Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Cart from '@/components/Cart/Cart';
import { Button } from '@/components/ui/button';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, addToWishlist, items } = useCart();

  const products = [
    {
      id: '1',
      name: 'Premium Hair Serum',
      price: 45.99,
      originalPrice: 59.99,
      category: 'Hair Care',
      rating: 4.8,
      reviews: 124,
      image: '/placeholder.svg',
      inStock: true,
      discount: 23,
      type: 'product' as const
    },
    {
      id: '2',
      name: 'Hydrating Face Mask',
      price: 28.50,
      category: 'Skincare',
      rating: 4.9,
      reviews: 89,
      image: '/placeholder.svg',
      inStock: true,
      type: 'product' as const
    },
    {
      id: '3',
      name: 'Professional Hair Dryer',
      price: 189.99,
      originalPrice: 249.99,
      category: 'Tools',
      rating: 4.7,
      reviews: 67,
      image: '/placeholder.svg',
      inStock: false,
      discount: 24,
      type: 'product' as const
    },
    {
      id: '4',
      name: 'Nail Polish Set',
      price: 35.00,
      category: 'Nail Care',
      rating: 4.6,
      reviews: 156,
      image: '/placeholder.svg',
      inStock: true,
      type: 'product' as const
    }
  ];

  const services = [
    {
      id: 'service-1',
      name: 'Hair Cut & Style',
      price: 65.00,
      duration: '60 min',
      description: 'Professional haircut with styling',
      popular: true,
      type: 'service' as const
    },
    {
      id: 'service-2',
      name: 'Facial Treatment',
      price: 85.00,
      duration: '75 min',
      description: 'Deep cleansing and hydrating facial',
      popular: false,
      type: 'service' as const
    },
    {
      id: 'service-3',
      name: 'Manicure & Pedicure',
      price: 45.00,
      duration: '45 min',
      description: 'Complete nail care service',
      popular: true,
      type: 'service' as const
    }
  ];

  const subscriptionPlans = [
    {
      id: 'sub-1',
      name: 'Beauty Box Monthly',
      price: 24.99,
      originalPrice: 39.99,
      description: '3-5 premium beauty products delivered monthly',
      type: 'product' as const,
      subscription: {
        interval: 'monthly' as const,
        originalPrice: 39.99
      }
    },
    {
      id: 'sub-2',
      name: 'Premium Care Yearly',
      price: 199.99,
      originalPrice: 299.99,
      description: 'Complete beauty care package with quarterly deliveries',
      type: 'product' as const,
      subscription: {
        interval: 'yearly' as const,
        originalPrice: 299.99
      }
    }
  ];

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Shop & Services</h1>
            <p className="text-purple-100">Products and services for your clients</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsCartOpen(true)}
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
        
        {/* Search Bar */}
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

      <div className="p-6 space-y-8">
        {/* Subscription Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Planos de Subscrição</h2>
            <button className="text-purple-600 font-medium hover:text-purple-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-purple-100 mb-3">{plan.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold">€{plan.price}</span>
                      <span className="text-lg line-through text-purple-200">€{plan.originalPrice}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                        -{Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-purple-100 mt-1">
                      por {plan.subscription?.interval === 'monthly' ? 'mês' : 'ano'}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => addToCart(plan)}
                      className="bg-white text-purple-600 hover:bg-gray-100"
                    >
                      Subscrever
                    </Button>
                    <Button
                      onClick={() => addToWishlist(plan)}
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Services</h2>
            <button className="text-purple-600 font-medium hover:text-purple-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      {service.popular && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{service.description}</p>
                    <p className="text-sm text-purple-600 font-medium">{service.duration}</p>
                  </div>
                  <div className="text-right flex flex-col space-y-2">
                    <p className="text-2xl font-bold text-gray-900">€{service.price}</p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => addToCart(service)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200"
                      >
                        Adicionar
                      </Button>
                      <Button
                        onClick={() => addToWishlist(service)}
                        variant="outline"
                        size="icon"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
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
                    onClick={() => addToWishlist(product)}
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
                      onClick={() => addToCart(product)}
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

        {/* Dynamic Pricing Info */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Dynamic Pricing</h3>
          <p className="text-blue-100 mb-4">Automatically adjust prices based on demand, time, and client preferences</p>
          <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
            Configure Pricing
          </button>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Shop;
