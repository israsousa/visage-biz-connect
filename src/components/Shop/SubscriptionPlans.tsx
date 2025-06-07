
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/contexts/CartContext';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  type: 'product';
  subscription: {
    interval: 'monthly' | 'yearly';
    originalPrice: number;
  };
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  onAddToCart: (item: CartItem) => void;
  onAddToWishlist: (item: Omit<CartItem, 'quantity'>) => void;
}

const SubscriptionPlans = ({ plans, onAddToCart, onAddToWishlist }: SubscriptionPlansProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Planos de Subscrição</h2>
        <button className="text-purple-600 font-medium hover:text-purple-700">View All</button>
      </div>
      
      <div className="space-y-4">
        {plans.map((plan) => (
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
                  onClick={() => onAddToCart(plan)}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Subscrever
                </Button>
                <Button
                  onClick={() => onAddToWishlist(plan)}
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
  );
};

export default SubscriptionPlans;
