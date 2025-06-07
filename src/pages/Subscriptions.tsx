
import React, { useState } from 'react';
import { Calendar, CreditCard, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Subscriptions = () => {
  const [activeSubscriptions] = useState([
    {
      id: '1',
      name: 'Plano Premium',
      price: 29.99,
      interval: 'monthly',
      nextBilling: '2024-01-15',
      status: 'active',
      features: ['Agendamentos ilimitados', 'Analytics avançadas', 'Suporte prioritário']
    },
    {
      id: '2',
      name: 'Kit de Produtos Mensais',
      price: 49.99,
      interval: 'monthly',
      nextBilling: '2024-01-20',
      status: 'active',
      features: ['3-5 produtos premium', 'Entrega gratuita', 'Desconto de 30%']
    }
  ]);

  const [availablePlans] = useState([
    {
      id: 'basic',
      name: 'Básico',
      price: 9.99,
      interval: 'monthly',
      features: ['Até 50 agendamentos/mês', 'Analytics básicas', 'Email support'],
      recommended: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      interval: 'monthly',
      features: ['Agendamentos ilimitados', 'Analytics avançadas', 'Suporte prioritário', 'Integração WhatsApp'],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      interval: 'monthly',
      features: ['Tudo do Premium', 'Multi-localização', 'API personalizada', 'Gestor dedicado'],
      recommended: false
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Subscrições</h1>
        <p className="text-purple-100 mt-2">Gerir os seus planos e subscrições</p>
      </div>

      <div className="p-6 space-y-8">
        {/* Subscrições Ativas */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subscrições Ativas</h2>
          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      €{subscription.price.toFixed(2)}
                      <span className="text-sm font-normal text-gray-500">/{subscription.interval === 'monthly' ? 'mês' : 'ano'}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Ativa</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Próxima cobrança: {subscription.nextBilling}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Gerir
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planos Disponíveis */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alterar Plano</h2>
          <div className="grid gap-4">
            {availablePlans.map((plan) => (
              <div key={plan.id} className={`bg-white rounded-2xl p-6 shadow-sm border ${plan.recommended ? 'border-purple-300 ring-2 ring-purple-100' : 'border-purple-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      {plan.recommended && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      €{plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-gray-500">/{plan.interval === 'monthly' ? 'mês' : 'ano'}</span>
                    </p>
                  </div>
                  <Button 
                    className={plan.recommended ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
                    variant={plan.recommended ? 'default' : 'outline'}
                  >
                    Selecionar
                  </Button>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Faturas */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Faturas</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-purple-50">
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { date: '2024-01-01', amount: 29.99, status: 'paid', invoice: 'INV-2024-001' },
                  { date: '2023-12-01', amount: 29.99, status: 'paid', invoice: 'INV-2023-012' },
                  { date: '2023-11-01', amount: 29.99, status: 'paid', invoice: 'INV-2023-011' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoice}</p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-900">€{invoice.amount.toFixed(2)}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pago
                      </span>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
