
import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getShippingCost, 
    getTax, 
    getFinalTotal,
    clearCart 
  } = useCart();
  
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment'>('cart');

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (step === 'cart') {
      setStep('shipping');
    } else if (step === 'shipping') {
      setStep('payment');
    } else {
      // Processar pagamento
      console.log('Processing payment...');
      clearCart();
      onClose();
      setStep('cart');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {step === 'cart' && 'Carrinho'}
              {step === 'shipping' && 'Envio'}
              {step === 'payment' && 'Pagamento'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {step === 'cart' && (
          <div className="p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">O seu carrinho está vazio</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image || '/placeholder.svg'} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-purple-600 font-semibold">€{item.price.toFixed(2)}</p>
                        {item.subscription && (
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                            {item.subscription.interval}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envio:</span>
                    <span>€{getShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (23%):</span>
                    <span>€{getTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>€{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full mt-6">
                  Continuar para Envio
                </Button>
              </>
            )}
          </div>
        )}

        {step === 'shipping' && (
          <div className="p-4">
            <ShippingForm onNext={handleCheckout} onBack={() => setStep('cart')} />
          </div>
        )}

        {step === 'payment' && (
          <div className="p-4">
            <PaymentForm onComplete={handleCheckout} onBack={() => setStep('shipping')} />
          </div>
        )}
      </div>
    </div>
  );
};

const ShippingForm = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const { setShippingAddress } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Portugal',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingAddress(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold">Endereço de Envio</h3>
      </div>
      
      <input
        type="text"
        placeholder="Nome completo"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      />
      
      <input
        type="text"
        placeholder="Rua e número"
        value={formData.street}
        onChange={(e) => setFormData({...formData, street: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cidade"
          value={formData.city}
          onChange={(e) => setFormData({...formData, city: e.target.value})}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
        <input
          type="text"
          placeholder="Código postal"
          value={formData.postalCode}
          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
      
      <input
        type="tel"
        placeholder="Telefone"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      />
      
      <div className="flex space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Continuar para Pagamento
        </Button>
      </div>
    </form>
  );
};

const PaymentForm = ({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mbway' | 'subscription'>('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold">Método de Pagamento</h3>
      </div>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value as 'card')}
            className="text-purple-500"
          />
          <span>Cartão de Crédito/Débito</span>
        </label>
        
        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="mbway"
            checked={paymentMethod === 'mbway'}
            onChange={(e) => setPaymentMethod(e.target.value as 'mbway')}
            className="text-purple-500"
          />
          <span>MB WAY</span>
        </label>
        
        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="payment"
            value="subscription"
            checked={paymentMethod === 'subscription'}
            onChange={(e) => setPaymentMethod(e.target.value as 'subscription')}
            className="text-purple-500"
          />
          <span>Subscrição Mensal</span>
        </label>
      </div>
      
      {paymentMethod === 'card' && (
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Número do cartão"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/AA"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="CVV"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      )}
      
      {paymentMethod === 'mbway' && (
        <input
          type="tel"
          placeholder="Número de telemóvel"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      )}
      
      <div className="flex space-x-4 mt-6">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Finalizar Compra
        </Button>
      </div>
    </form>
  );
};

export default Cart;
