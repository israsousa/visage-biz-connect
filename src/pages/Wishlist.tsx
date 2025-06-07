
import React from 'react';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Lista de Desejos</h1>
        </div>
        <p className="text-purple-100 mt-2">Os seus produtos favoritos</p>
      </div>

      <div className="p-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Sua lista de desejos está vazia
            </h3>
            <p className="text-gray-500 mb-6">
              Adicione produtos que gosta para não os perder de vista
            </p>
            <Button onClick={() => window.location.href = '/shop'}>
              Explorar Produtos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-purple-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-purple-600 font-bold text-lg">€{item.price.toFixed(2)}</p>
                    {item.subscription && (
                      <span className="inline-block bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium mt-2">
                        Subscrição {item.subscription.interval}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                    <Button
                      onClick={() => removeFromWishlist(item.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
