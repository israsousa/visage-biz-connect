
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'product' | 'service';
  image?: string;
  subscription?: {
    interval: 'monthly' | 'yearly';
    originalPrice: number;
  };
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface CartContextType {
  items: CartItem[];
  wishlist: CartItem[];
  shippingAddress: ShippingAddress | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromWishlist: (id: string) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  getTotalPrice: () => number;
  getShippingCost: () => number;
  getTax: () => number;
  getFinalTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const addToWishlist = (item: Omit<CartItem, 'quantity'>) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const total = getTotalPrice();
    if (total > 50) return 0; // Envio grátis acima de 50€
    return 5.99;
  };

  const getTax = () => {
    return getTotalPrice() * 0.23; // IVA 23%
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost() + getTax();
  };

  return (
    <CartContext.Provider value={{
      items,
      wishlist,
      shippingAddress,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      setShippingAddress,
      getTotalPrice,
      getShippingCost,
      getTax,
      getFinalTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
