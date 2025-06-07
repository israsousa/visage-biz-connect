
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Cart from '@/components/Cart/Cart';
import SearchHeader from '@/components/Shop/SearchHeader';
import SubscriptionPlans from '@/components/Shop/SubscriptionPlans';
import ServicesSection from '@/components/Shop/ServicesSection';
import ProductsSection from '@/components/Shop/ProductsSection';
import DynamicPricingInfo from '@/components/Shop/DynamicPricingInfo';

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
      <SearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="p-6 space-y-8">
        <SubscriptionPlans 
          plans={subscriptionPlans}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
        />

        <ServicesSection 
          services={services}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
        />

        <ProductsSection 
          products={products}
          onAddToCart={addToCart}
          onAddToWishlist={addToWishlist}
        />

        <DynamicPricingInfo />
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Shop;
