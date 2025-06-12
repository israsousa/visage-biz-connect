import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  Appointment, 
  Service, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  AppointmentFilters,
  AvailabilityRequest,
  AvailabilityResponse,
  AppointmentStatistics,
  TimeSlot,
  APPOINTMENT_STATUS
} from '@/types/appointment';

interface AppointmentContextType {
  // State
  appointments: Appointment[];
  services: Service[];
  loading: boolean;
  error: string | null;

  // Appointment CRUD
  createAppointment: (request: CreateAppointmentRequest) => Promise<Appointment>;
  updateAppointment: (request: UpdateAppointmentRequest) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointments: (filters?: AppointmentFilters) => Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;

  // Availability
  checkAvailability: (request: AvailabilityRequest) => Promise<AvailabilityResponse>;
  getAvailableTimeSlots: (date: string, serviceId: string) => TimeSlot[];
  getAllTimeSlots: (date: string, serviceId: string) => TimeSlot[];

  // Services
  getServices: () => Service[];
  getServiceById: (id: string) => Service | undefined;

  // Statistics
  getStatistics: () => AppointmentStatistics;

  // Utility functions
  refreshAppointments: () => Promise<void>;
  clearError: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Default services based on existing BookAppointment.tsx
const defaultServices: Service[] = [
  {
    id: 'service-1',
    name: 'Hair Cut & Style',
    price: 65,
    duration: 60,
    description: 'Professional haircut with styling',
    category: 'Hair Care'
  },
  {
    id: 'service-2',
    name: 'Hair Color',
    price: 120,
    duration: 120,
    description: 'Full hair coloring service',
    category: 'Hair Care'
  },
  {
    id: 'service-3',
    name: 'Facial Treatment',
    price: 85,
    duration: 75,
    description: 'Deep cleansing and hydrating facial',
    category: 'Skincare'
  },
  {
    id: 'service-4',
    name: 'Manicure',
    price: 35,
    duration: 30,
    description: 'Complete nail care for hands',
    category: 'Nail Care'
  },
  {
    id: 'service-5',
    name: 'Pedicure',
    price: 45,
    duration: 45,
    description: 'Complete nail care for feet',
    category: 'Nail Care'
  },
  {
    id: 'service-6',
    name: 'Mani + Pedi',
    price: 75,
    duration: 75,
    description: 'Complete nail care for hands and feet',
    category: 'Nail Care'
  }
];

// Mock appointments data with international phone numbers
const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientInfo: {
      name: 'Maria Silva',
      phone: '+351912345678',
      email: 'maria@email.com',
      gender: 'Mulher',
      isAnonymous: false
    },
    serviceId: 'service-1',
    service: defaultServices[0],
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    whatsappConfirmation: true
  },
  {
    id: '2',
    clientInfo: {
      name: 'Ana Costa',
      phone: '+5511999999999',
      email: 'ana@email.com',
      gender: 'Mulher',
      isAnonymous: false,
      notes: 'Cliente do Brasil - fala português'
    },
    serviceId: 'service-3',
    service: defaultServices[2],
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    endTime: '15:45',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    clientInfo: {
      name: 'John Smith',
      phone: '+15551234567',
      gender: 'Homem',
      isAnonymous: false,
      notes: 'Cliente americano - inglês'
    },
    serviceId: 'service-6',
    service: defaultServices[5],
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    time: '16:00',
    endTime: '17:15',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    clientInfo: {
      name: 'Sophie Dubois',
      phone: '+33612345678',
      email: 'sophie@email.fr',
      gender: 'Mulher',
      isAnonymous: false,
      notes: 'Cliente francesa'
    },
    serviceId: 'service-2',
    service: defaultServices[1],
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // day after tomorrow
    time: '15:00',
    endTime: '17:00',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    clientInfo: {
      name: 'Hans Mueller',
      phone: '+491601234567',
      gender: 'Homem',
      isAnonymous: false,
      notes: 'Cliente alemão'
    },
    serviceId: 'service-4',
    service: defaultServices[3],
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    endTime: '12:30',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [services] = useState<Service[]>(defaultServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Business hours configuration
  const businessHours = {
    start: '09:00',
    end: '18:00',
    interval: 30 // 30-minute slots
  };

  const generateTimeSlots = useCallback((start: string, end: string, interval: number): string[] => {
    const slots: string[] = [];
    const startTime = new Date(`2000-01-01T${start}:00`);
    const endTime = new Date(`2000-01-01T${end}:00`);
    
    const currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    
    return slots;
  }, []);

  const createAppointment = useCallback(async (request: CreateAppointmentRequest): Promise<Appointment> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const service = services.find(s => s.id === request.serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      // Check for conflicts
      const startTime = new Date(`${request.date}T${request.time}:00`);
      const endTime = new Date(startTime.getTime() + service.duration * 60000);
      
      const hasConflict = appointments.some(apt => {
        if (apt.date !== request.date) return false;
        
        const aptStart = new Date(`${apt.date}T${apt.time}:00`);
        const aptEnd = new Date(`${apt.date}T${apt.endTime}:00`);
        
        return (startTime < aptEnd && endTime > aptStart);
      });

      if (hasConflict) {
        throw new Error('Time slot is not available');
      }

      const newAppointment: Appointment = {
        id: Date.now().toString(),
        clientInfo: request.clientInfo,
        serviceId: request.serviceId,
        service,
        date: request.date,
        time: request.time,
        endTime: endTime.toTimeString().slice(0, 5),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create appointment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [appointments, services]);

  const updateAppointment = useCallback(async (request: UpdateAppointmentRequest): Promise<Appointment> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const existingAppointment = appointments.find(apt => apt.id === request.id);
      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      let updatedService = existingAppointment.service;
      if (request.serviceId) {
        const service = services.find(s => s.id === request.serviceId);
        if (!service) {
          throw new Error('Service not found');
        }
        updatedService = service;
      }

      const updatedAppointment: Appointment = {
        ...existingAppointment,
        ...request,
        service: updatedService,
        clientInfo: request.clientInfo ? { ...existingAppointment.clientInfo, ...request.clientInfo } : existingAppointment.clientInfo,
        updatedAt: new Date().toISOString()
      };

      // Recalculate end time if time or service changed
      if (request.time || request.serviceId) {
        const startTime = new Date(`${updatedAppointment.date}T${updatedAppointment.time}:00`);
        const endTime = new Date(startTime.getTime() + updatedService.duration * 60000);
        updatedAppointment.endTime = endTime.toTimeString().slice(0, 5);
      }

      setAppointments(prev => prev.map(apt => apt.id === request.id ? updatedAppointment : apt));
      return updatedAppointment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update appointment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [appointments, services]);

  const deleteAppointment = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete appointment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAppointments = useCallback((filters?: AppointmentFilters): Appointment[] => {
    let filtered = [...appointments];

    if (filters?.date) {
      filtered = filtered.filter(apt => apt.date === filters.date);
    }

    if (filters?.status && filters.status.length > 0) {
      filtered = filtered.filter(apt => filters.status!.includes(apt.status));
    }

    if (filters?.clientName) {
      filtered = filtered.filter(apt => 
        apt.clientInfo.name.toLowerCase().includes(filters.clientName!.toLowerCase())
      );
    }

    if (filters?.serviceId) {
      filtered = filtered.filter(apt => apt.serviceId === filters.serviceId);
    }

    return filtered.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [appointments]);

  const getAppointmentById = useCallback((id: string): Appointment | undefined => {
    return appointments.find(apt => apt.id === id);
  }, [appointments]);

  const checkAvailability = useCallback(async (request: AvailabilityRequest): Promise<AvailabilityResponse> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const timeSlots = generateTimeSlots(businessHours.start, businessHours.end, businessHours.interval);
      const service = services.find(s => s.id === request.serviceId);
      
      if (!service) {
        throw new Error('Service not found');
      }

      const dayAppointments = appointments.filter(apt => apt.date === request.date);
      
      const availableSlots: TimeSlot[] = timeSlots.map(time => {
        const slotStart = new Date(`${request.date}T${time}:00`);
        const slotEnd = new Date(slotStart.getTime() + service.duration * 60000);
        
        const isAvailable = !dayAppointments.some(apt => {
          const aptStart = new Date(`${apt.date}T${apt.time}:00`);
          const aptEnd = new Date(`${apt.date}T${apt.endTime}:00`);
          
          return (slotStart < aptEnd && slotEnd > aptStart);
        });

        const conflictingAppointment = dayAppointments.find(apt => {
          const aptStart = new Date(`${apt.date}T${apt.time}:00`);
          const aptEnd = new Date(`${apt.date}T${apt.endTime}:00`);
          return (slotStart < aptEnd && slotEnd > aptStart);
        });

        return {
          time,
          available: isAvailable,
          appointmentId: conflictingAppointment?.id
        };
      });

      return {
        date: request.date,
        timeSlots: availableSlots,
        businessHours
      };
    } finally {
      setLoading(false);
    }
  }, [appointments, services, generateTimeSlots, businessHours]);

  const getAvailableTimeSlots = useCallback((date: string, serviceId: string): TimeSlot[] => {
    const timeSlots = generateTimeSlots(businessHours.start, businessHours.end, businessHours.interval);
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return [];

    const dayAppointments = appointments.filter(apt => apt.date === date);
    
    return timeSlots.map(time => {
      const slotStart = new Date(`${date}T${time}:00`);
      const slotEnd = new Date(slotStart.getTime() + service.duration * 60000);
      
      const conflictingAppointment = dayAppointments.find(apt => {
        const aptStart = new Date(`${apt.date}T${apt.time}:00`);
        const aptEnd = new Date(`${apt.date}T${apt.endTime}:00`);
        
        return (slotStart < aptEnd && slotEnd > aptStart);
      });

      return {
        time,
        available: !conflictingAppointment,
        appointmentId: conflictingAppointment?.id
      };
    }).filter(slot => slot.available);
  }, [appointments, services, generateTimeSlots, businessHours]);

  const getAllTimeSlots = useCallback((date: string, serviceId: string): TimeSlot[] => {
    const timeSlots = generateTimeSlots(businessHours.start, businessHours.end, businessHours.interval);
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return [];

    const dayAppointments = appointments.filter(apt => apt.date === date);
    
    return timeSlots.map(time => {
      const slotStart = new Date(`${date}T${time}:00`);
      const slotEnd = new Date(slotStart.getTime() + service.duration * 60000);
      
      const conflictingAppointment = dayAppointments.find(apt => {
        const aptStart = new Date(`${apt.date}T${apt.time}:00`);
        const aptEnd = new Date(`${apt.date}T${apt.endTime}:00`);
        
        return (slotStart < aptEnd && slotEnd > aptStart);
      });

      return {
        time,
        available: !conflictingAppointment,
        appointmentId: conflictingAppointment?.id
      };
    });
  }, [appointments, services, generateTimeSlots, businessHours]);

  const getServices = useCallback((): Service[] => {
    return services;
  }, [services]);

  const getServiceById = useCallback((id: string): Service | undefined => {
    return services.find(service => service.id === id);
  }, [services]);

  const getStatistics = useCallback((): AppointmentStatistics => {
    const today = new Date().toISOString().split('T')[0];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStart = startOfMonth.toISOString().split('T')[0];

    return {
      total: appointments.length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      pending: appointments.filter(apt => apt.status === 'pending').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      noShow: appointments.filter(apt => apt.status === 'no_show').length,
      todayCount: appointments.filter(apt => apt.date === today).length,
      weekCount: appointments.filter(apt => apt.date >= weekStart).length,
      monthCount: appointments.filter(apt => apt.date >= monthStart).length
    };
  }, [appointments]);

  const refreshAppointments = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would fetch from API
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AppointmentContextType = {
    appointments,
    services,
    loading,
    error,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointments,
    getAppointmentById,
    checkAvailability,
    getAvailableTimeSlots,
    getAllTimeSlots,
    getServices,
    getServiceById,
    getStatistics,
    refreshAppointments,
    clearError
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};