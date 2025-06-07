
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BarChart3, ShoppingBag, Users, Plus, Smartphone, Computer } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const BottomNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const getNavItems = () => [
    { path: '/', icon: isMobile ? Smartphone : Computer, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/book', icon: Plus, label: 'Book', isAction: true },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/suppliers', icon: Users, label: 'Suppliers' },
  ];

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label, isAction }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isAction
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                  : isActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-400 hover:text-purple-500'
              }`}
            >
              <Icon size={isAction ? 24 : 20} className={isAction ? 'mb-1' : ''} />
              <span className={`text-xs font-medium ${isAction ? 'hidden' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
