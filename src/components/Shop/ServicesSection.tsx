
import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/contexts/CartContext';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  popular: boolean;
  type: 'service';
}

interface ServicesSectionProps {
  services: Service[];
  onAddToCart: (item: CartItem) => void;
  onAddToWishlist: (item: Omit<CartItem, 'quantity'>) => void;
}

const ServicesSection = ({ services, onAddToCart, onAddToWishlist }: ServicesSectionProps) => {
  return (
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
                    onClick={() => onAddToCart(service)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-200"
                  >
                    Adicionar
                  </Button>
                  <Button
                    onClick={() => onAddToWishlist(service)}
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
  );
};

export default ServicesSection;
