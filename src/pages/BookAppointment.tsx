
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MessageCircle, CheckCircle, Loader2, ChevronDown, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppointments } from '@/contexts/AppointmentContext';
import { createAppointmentSchema, CreateAppointmentForm } from '@/lib/validations/appointment';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [allSlots, setAllSlots] = useState<{time: string, available: boolean, appointmentId?: string}[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  const { createAppointment, getServices, getAllTimeSlots, loading } = useAppointments();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const services = getServices();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm<CreateAppointmentForm>({
    resolver: zodResolver(createAppointmentSchema),
    mode: 'onChange'
  });
  
  const watchedService = watch('serviceId');
  const watchedDate = watch('date');
  const watchedTime = watch('time');

  // Check availability when service or date changes
  useEffect(() => {
    if (watchedService && watchedDate) {
      setIsCheckingAvailability(true);
      
      // Simulate API delay for better UX
      const timeoutId = setTimeout(() => {
        const slots = getAllTimeSlots(watchedDate, watchedService);
        setAllSlots(slots);
        setIsCheckingAvailability(false);
        
        // Clear selected time if it's no longer available
        if (watchedTime && !slots.some(slot => slot.time === watchedTime && slot.available)) {
          setValue('time', '');
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setAllSlots([]);
    }
  }, [watchedService, watchedDate, watchedTime, getAllTimeSlots, setValue]);

  const onSubmit = async (data: CreateAppointmentForm) => {
    try {
      await createAppointment(data);
      
      toast({
        title: 'Agendamento criado com sucesso!',
        description: 'Receberá uma confirmação por WhatsApp em breve.',
      });
      
      reset();
      navigate('/appointments');
    } catch (error) {
      toast({
        title: 'Erro ao criar agendamento',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Book Appointment</h1>
          <p className="text-purple-100">Schedule your next beauty session</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Service Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            Select Service
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {services.map((service) => (
              <label key={service.id} className="cursor-pointer">
                <input
                  type="radio"
                  value={service.id}
                  {...register('serviceId')}
                  className="sr-only"
                />
                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  watchedService === service.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.duration} min</p>
                    </div>
                    <p className="text-lg font-bold text-purple-600">€{service.price}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.serviceId && (
            <p className="text-sm text-red-600 mt-2">{errors.serviceId.message}</p>
          )}
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Select Date
          </h3>
          <input
            type="date"
            {...register('date')}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.date ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.date && (
            <p className="text-sm text-red-600 mt-2">{errors.date.message}</p>
          )}
        </div>

        {/* Time Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Select Time
          </h3>
          {isCheckingAvailability ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Verificando disponibilidade...</span>
            </div>
          ) : allSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {allSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => slot.available ? setValue('time', slot.time) : null}
                  disabled={!slot.available}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 relative ${
                    !slot.available
                      ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60'
                      : watchedTime === slot.time
                      ? 'border-purple-500 bg-purple-50 text-purple-600'
                      : 'border-green-200 hover:border-green-400 bg-green-50 text-green-700'
                  }`}
                  title={!slot.available ? 'Horário ocupado' : 'Clique para selecionar'}
                >
                  {slot.time}
                  {!slot.available && (
                    <span className="absolute top-1 right-1 text-xs text-red-500">●</span>
                  )}
                </button>
              ))}
            </div>
          ) : watchedService && watchedDate ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum horário disponível para esta data.</p>
              <p className="text-sm text-gray-400 mt-1">Tente selecionar outra data.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Selecione um serviço e data primeiro</p>
            </div>
          )}
          
          {/* Legend */}
          {allSlots.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-green-200 rounded bg-green-50"></div>
                <span className="text-gray-600">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-red-200 rounded bg-red-50 relative">
                  <span className="absolute -top-0.5 -right-0.5 text-xs text-red-500">●</span>
                </div>
                <span className="text-gray-600">Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-purple-500 rounded bg-purple-50"></div>
                <span className="text-gray-600">Selecionado</span>
              </div>
            </div>
          )}
          {errors.time && (
            <p className="text-sm text-red-600 mt-2">{errors.time.message}</p>
          )}
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Informações do Cliente
          </h3>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nome Completo"
                {...register('clientInfo.name')}
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.clientInfo?.name ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.clientInfo?.name && (
                <p className="text-sm text-red-600 mt-1">{errors.clientInfo.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género (opcional)
              </label>
              <select
                {...register('clientInfo.gender')}
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.clientInfo?.gender ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Selecionar género</option>
                <option value="Homem">Homem</option>
                <option value="Mulher">Mulher</option>
                <option value="Prefiro não dizer">Prefiro não dizer</option>
              </select>
              {errors.clientInfo?.gender && (
                <p className="text-sm text-red-600 mt-1">{errors.clientInfo.gender.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <div className="relative">
                <div className="flex">
                  <div className="flex items-center px-4 bg-gray-50 border border-r-0 rounded-l-xl border-gray-200">
                    <span className="text-gray-700 font-mono">+351</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="912 345 678"
                    {...register('clientInfo.phone')}
                    className={`flex-1 p-4 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.clientInfo?.phone ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Para outros países, substitua +351 pelo código do seu país
                </p>
              </div>
              
              {/* Collapsible Information */}
              <details className="mt-3 group">
                <summary className="flex items-center gap-2 cursor-pointer text-sm text-purple-600 hover:text-purple-700">
                  <Info className="w-4 h-4" />
                  <span>Informações sobre números aceites</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <p className="font-medium mb-2">Aceita números de qualquer país:</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span>🇵🇹 Portugal: 912 345 678</span>
                    <span>🇧🇷 Brasil: +55 11 99999 9999</span>
                    <span>🇪🇸 Espanha: +34 612 345 678</span>
                    <span>🇫🇷 França: +33 6 12 34 56 78</span>
                    <span>🇩🇪 Alemanha: +49 160 1234567</span>
                    <span>🇮🇹 Itália: +39 320 123 4567</span>
                    <span>🇬🇧 Reino Unido: +44 7700 900123</span>
                    <span>🇺🇸 EUA: +1 555 123 4567</span>
                  </div>
                  <div className="mt-2 p-2 bg-purple-50 rounded border-l-4 border-purple-500">
                    <p className="text-purple-700 font-medium">Nota:</p>
                    <p className="text-purple-600">Números sem código de país são automaticamente tratados como Portugal (+351)</p>
                  </div>
                </div>
              </details>
              
              {errors.clientInfo?.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.clientInfo.phone.message}</p>
              )}
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email (opcional)"
                {...register('clientInfo.email')}
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.clientInfo?.email ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.clientInfo?.email && (
                <p className="text-sm text-red-600 mt-1">{errors.clientInfo.email.message}</p>
              )}
            </div>
            
            <div>
              <textarea
                placeholder="Pedidos especiais ou observações..."
                {...register('clientInfo.notes')}
                rows={3}
                className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  errors.clientInfo?.notes ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.clientInfo?.notes && (
                <p className="text-sm text-red-600 mt-1">{errors.clientInfo.notes.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Integration */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">WhatsApp Confirmation</h3>
          </div>
          <p className="text-green-100 text-sm">
            Appointment confirmations and reminders will be sent via WhatsApp
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Criando Agendamento...' : 'Agendar Consulta'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
