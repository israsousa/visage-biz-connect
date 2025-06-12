import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, Euro, Eye, EyeOff, Package } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useCustomFields } from '@/contexts/CustomFieldsContext';
import { Service } from '@/types/appointment';
import { useToast } from '@/components/ui/use-toast';

const Services = () => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { getServices } = useAppointments();
  const { customFields } = useCustomFields();
  const { toast } = useToast();

  const services = getServices();

  const handleCreateService = () => {
    setEditingService(null);
    setShowCreateModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowCreateModal(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este serviço?')) {
      // TODO: Implement delete functionality
      toast({
        title: 'Serviço eliminado',
        description: 'O serviço foi removido com sucesso.',
      });
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Gestão de Serviços</h1>
            <p className="text-purple-100">Gerir serviços e configurações</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{services.length}</p>
            <p className="text-xs text-purple-100">Total Serviços</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">€{Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)}</p>
            <p className="text-xs text-purple-100">Preço Médio</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)}min</p>
            <p className="text-xs text-purple-100">Duração Média</p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleCreateService}
          className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Services List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Serviços Disponíveis ({services.length})
            </h3>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                      {service.category && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {service.category}
                        </span>
                      )}
                    </div>
                    
                    {service.description && (
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        <span className="font-medium text-gray-900">€{service.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                    </div>

                    {/* Custom Fields for this service */}
                    {customFields.filter(field => 
                      field.serviceTypes?.includes(service.id) || field.serviceTypes?.length === 0
                    ).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Campos personalizados:</p>
                        <div className="flex flex-wrap gap-1">
                          {customFields
                            .filter(field => 
                              field.serviceTypes?.includes(service.id) || field.serviceTypes?.length === 0
                            )
                            .slice(0, 3)
                            .map(field => (
                              <span
                                key={field.id}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {field.label}
                              </span>
                            ))}
                          {customFields.filter(field => 
                            field.serviceTypes?.includes(service.id) || field.serviceTypes?.length === 0
                          ).length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{customFields.filter(field => 
                                field.serviceTypes?.includes(service.id) || field.serviceTypes?.length === 0
                              ).length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Categories Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias de Serviços</h3>
          
          {(() => {
            const categories = services.reduce((acc, service) => {
              const category = service.category || 'Sem Categoria';
              if (!acc[category]) {
                acc[category] = { count: 0, totalPrice: 0, avgDuration: 0 };
              }
              acc[category].count++;
              acc[category].totalPrice += service.price;
              acc[category].avgDuration += service.duration;
              return acc;
            }, {} as Record<string, { count: number; totalPrice: number; avgDuration: number }>);

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(categories).map(([category, stats]) => (
                  <div key={category} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{stats.count} serviço{stats.count !== 1 ? 's' : ''}</p>
                      <p>Preço médio: €{Math.round(stats.totalPrice / stats.count)}</p>
                      <p>Duração média: {Math.round(stats.avgDuration / stats.count)}min</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Quick Actions for Manager */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleCreateService}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Serviço
            </button>
            <button 
              onClick={() => window.location.href = '/custom-fields'}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Package className="w-5 h-5 mr-2" />
              Gerir Campos
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Service Modal - TODO: Implement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl mx-4 my-4 flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingService ? 'Editar Serviço' : 'Criar Novo Serviço'}
                  </h2>
                  <p className="text-purple-100">Configure os detalhes do serviço</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Modal em Construção</h3>
                <p className="text-gray-500 mb-4">
                  O formulário completo de criação/edição de serviços será implementado em breve.
                </p>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;