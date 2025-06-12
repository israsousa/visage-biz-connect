import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Phone } from 'lucide-react';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Appointment } from '@/types/appointment';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';

interface AppointmentCalendarProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getAppointments } = useAppointments();
  const { formatPhoneDisplay, detectCountryFromPhone } = usePhoneFormatter();

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0];
      const appointments = getAppointments({ date: dateStr });
      
      days.push({
        date: new Date(current),
        dateStr,
        isCurrentMonth: current.getMonth() === month,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isSelected: dateStr === selectedDate,
        appointments
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentMonth, getAppointments, selectedDate]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDateClick = (dateStr: string) => {
    onDateSelect?.(dateStr);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Calendário de Agendamentos
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h4 className="text-lg font-medium min-w-[180px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            onClick={() => day.isCurrentMonth && handleDateClick(day.dateStr)}
            className={`
              p-2 min-h-[100px] border rounded-lg cursor-pointer transition-all duration-200 
              ${day.isCurrentMonth 
                ? day.isSelected 
                  ? 'bg-purple-100 border-purple-300' 
                  : day.isToday 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'hover:bg-gray-50 border-gray-200'
                : 'bg-gray-50 border-gray-100 cursor-default'
              }
            `}
          >
            <div className="flex flex-col h-full">
              <span className={`text-sm font-medium mb-1 ${
                day.isCurrentMonth 
                  ? day.isToday 
                    ? 'text-blue-600' 
                    : 'text-gray-900'
                  : 'text-gray-400'
              }`}>
                {day.date.getDate()}
              </span>
              
              {/* Appointments indicators */}
              {day.isCurrentMonth && day.appointments.length > 0 && (
                <div className="flex-1 space-y-1">
                  {day.appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`text-xs p-1 rounded text-white truncate ${getStatusColor(appointment.status)}`}
                      title={`${appointment.time} - ${appointment.clientInfo.name} - ${appointment.service.name}`}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{appointment.time} {appointment.clientInfo.name}</span>
                      </div>
                    </div>
                  ))}
                  
                  {day.appointments.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{day.appointments.length - 3} mais
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected date details */}
      {selectedDate && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Agendamentos para {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-PT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h4>
          
          {(() => {
            const dayAppointments = getAppointments({ date: selectedDate });
            
            if (dayAppointments.length === 0) {
              return (
                <div className="text-center py-4 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum agendamento para este dia</p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {dayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{appointment.time} - {appointment.endTime}</span>
                        <span className="text-sm text-purple-600">{appointment.service.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.clientInfo.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="flex items-center gap-1">
                            <span className="text-base">{detectCountryFromPhone(appointment.clientInfo.phone).flag}</span>
                            <span>{formatPhoneDisplay(appointment.clientInfo.phone)}</span>
                          </span>
                        </div>
                      </div>
                      
                      {appointment.clientInfo.notes && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {appointment.clientInfo.notes}
                        </p>
                      )}
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {appointment.status === 'confirmed' ? 'Confirmado' :
                       appointment.status === 'pending' ? 'Pendente' :
                       appointment.status === 'cancelled' ? 'Cancelado' :
                       appointment.status === 'completed' ? 'Concluído' :
                       appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="border-t pt-4 mt-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Legenda:</h5>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
};