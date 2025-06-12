import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Clock, User, CheckCircle, Loader2 } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { updateAppointmentSchema, UpdateAppointmentForm } from '@/lib/validations/appointment';
import { Appointment, Service } from '@/types/appointment';
import { useToast } from '@/components/ui/use-toast';

interface EditAppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [allSlots, setAllSlots] = useState<{time: string, available: boolean, appointmentId?: string}[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  const { updateAppointment, getServices, getAllTimeSlots, loading } = useAppointments();
  const { toast } = useToast();
  
  const services = getServices();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<UpdateAppointmentForm>({
    resolver: zodResolver(updateAppointmentSchema),
    mode: 'onChange'
  });
  
  const watchedService = watch('serviceId');
  const watchedDate = watch('date');
  const watchedTime = watch('time');

  // Initialize form with appointment data
  useEffect(() => {
    if (appointment && isOpen) {
      reset({
        id: appointment.id,
        clientInfo: {
          name: appointment.clientInfo.name,
          phone: appointment.clientInfo.phone,
          email: appointment.clientInfo.email || '',
          gender: appointment.clientInfo.gender || '',
          notes: appointment.clientInfo.notes || ''
        },
        serviceId: appointment.serviceId,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      });
    }
  }, [appointment, isOpen, reset]);

  // Check availability when service or date changes
  useEffect(() => {
    if (watchedService && watchedDate && appointment) {
      setIsCheckingAvailability(true);
      
      const timeoutId = setTimeout(() => {
        const slots = getAllTimeSlots(watchedDate, watchedService);
        // Mark current appointment time as available even if conflicted
        const currentTime = appointment.time;
        const updatedSlots = slots.map(slot => 
          slot.time === currentTime ? { ...slot, available: true } : slot
        );
        setAllSlots(updatedSlots);
        setIsCheckingAvailability(false);
        
        // Clear selected time if it's no longer available (except current time)
        if (watchedTime && watchedTime !== appointment.time && !slots.some(slot => slot.time === watchedTime && slot.available)) {
          setValue('time', '');
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setAllSlots([]);
    }
  }, [watchedService, watchedDate, watchedTime, getAllTimeSlots, setValue, appointment]);

  const onSubmit = async (data: UpdateAppointmentForm) => {
    if (!appointment) return;
    
    try {
      await updateAppointment(data);
      
      toast({
        title: 'Agendamento atualizado!',
        description: 'As alterações foram guardadas com sucesso.',
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar agendamento',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  const handleClose = () => {
    reset();
    setAvailableSlots([]);
    onClose();
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl mx-4 my-4 flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Editar Agendamento</h2>
              <p className="text-purple-100">Altere os dados do agendamento</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Service Selection */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              Serviço
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
                      : 'border-gray-200 hover:border-purple-300 bg-white'
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
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Data
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
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Horário
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
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    } ${slot.time === appointment.time ? 'ring-2 ring-yellow-300' : ''}`}
                    title={!slot.available ? 'Horário ocupado' : 'Clique para selecionar'}
                  >
                    {slot.time}
                    {!slot.available && (
                      <span className="absolute top-1 right-1 text-xs text-red-500">●</span>
                    )}
                    {slot.time === appointment.time && (
                      <span className="block text-xs text-yellow-600 mt-1">Atual</span>
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
            {errors.time && (
              <p className="text-sm text-red-600 mt-2">{errors.time.message}</p>
            )}
          </div>

          {/* Client Information */}
          <div className="bg-gray-50 rounded-2xl p-6">
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
                <input
                  type="tel"
                  placeholder="Telefone (+351 912 345 678)"
                  {...register('clientInfo.phone')}
                  className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.clientInfo?.phone ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
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
                <textarea
                  placeholder="Observações especiais..."
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Atualizando...' : 'Guardar Alterações'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};