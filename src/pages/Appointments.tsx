
import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Phone, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { APPOINTMENT_STATUS, AppointmentStatusType, Appointment } from '@/types/appointment';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { EditAppointmentModal } from '@/components/EditAppointmentModal';
import { AppointmentCalendar } from '@/components/AppointmentCalendar';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { getAppointments, updateAppointment, deleteAppointment, getStatistics, loading } = useAppointments();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { formatPhoneDisplay, detectCountryFromPhone } = usePhoneFormatter();
  
  const appointments = useMemo(() => {
    return getAppointments({ date: selectedDate });
  }, [getAppointments, selectedDate]);
  
  const statistics = getStatistics();

  const getStatusColor = (status: AppointmentStatusType) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'no_show':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: AppointmentStatusType) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      case 'no_show': return 'Faltou';
      default: return status;
    }
  };
  
  const handleStatusChange = async (appointmentId: string, newStatus: AppointmentStatusType) => {
    try {
      await updateAppointment({ id: appointmentId, status: newStatus });
      toast({
        title: 'Status atualizado',
        description: `Agendamento marcado como ${getStatusLabel(newStatus).toLowerCase()}.`
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Tem certeza de que deseja excluir este agendamento?')) {
      try {
        await deleteAppointment(appointmentId);
        toast({
          title: 'Agendamento excluído',
          description: 'O agendamento foi removido com sucesso.'
        });
      } catch (error) {
        toast({
          title: 'Erro ao excluir agendamento',
          description: error instanceof Error ? error.message : 'Tente novamente.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAppointment(null);
  };

  const handleEditSuccess = () => {
    // The appointment list will automatically refresh due to context
    toast({
      title: 'Agendamento atualizado',
      description: 'As alterações foram guardadas com sucesso.'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-purple-100">Manage your daily schedule</p>
          </div>
          <button 
            onClick={() => navigate('/book')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Date Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-transparent text-white placeholder-purple-200 border border-white/20 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Dia</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{appointments.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </p>
              <p className="text-sm text-gray-600">Confirmados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {appointments.filter(apt => apt.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-50 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento</h3>
              <p className="text-gray-500 mb-4">Não há agendamentos para esta data.</p>
              <button 
                onClick={() => navigate('/book')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Criar Agendamento
              </button>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.clientInfo.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                    <p className="text-purple-600 font-medium mb-1">{appointment.service.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time} - {appointment.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.service.duration} min</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEditAppointment(appointment)}
                      className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        title="Confirmar"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {appointment.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Cancelar"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{detectCountryFromPhone(appointment.clientInfo.phone).flag}</span>
                      <span>{formatPhoneDisplay(appointment.clientInfo.phone)}</span>
                    </span>
                    {appointment.clientInfo.email && (
                      <span className="text-gray-400">• {appointment.clientInfo.email}</span>
                    )}
                    {appointment.clientInfo.gender && (
                      <span className="text-gray-400">• {appointment.clientInfo.gender === 'Homem' ? '👨' : appointment.clientInfo.gender === 'Mulher' ? '👩' : '🤝'} {appointment.clientInfo.gender}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(`https://wa.me/${appointment.clientInfo.phone.replace(/\D/g, '')}`, '_blank')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
                
                {appointment.clientInfo.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Observações:</strong> {appointment.clientInfo.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Calendar Component */}
        <AppointmentCalendar 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* WhatsApp Integration Info */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">WhatsApp Booking</h3>
          <p className="text-green-100 mb-4">Agendamento automatizado via chatbot do WhatsApp</p>
          <div className="flex gap-3">
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
              Configurar Chatbot
            </button>
            <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
              Ver Estatísticas
            </button>
          </div>
        </div>
      </div>

      {/* Edit Appointment Modal */}
      <EditAppointmentModal
        appointment={editingAppointment}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default Appointments;
