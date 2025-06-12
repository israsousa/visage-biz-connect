export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description?: string;
  category?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface AppointmentStatus {
  PENDING: 'pending';
  CONFIRMED: 'confirmed';
  COMPLETED: 'completed';
  CANCELLED: 'cancelled';
  NO_SHOW: 'no_show';
}

export const APPOINTMENT_STATUS: AppointmentStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const;

export type AppointmentStatusType = keyof AppointmentStatus;

export interface ClientInfo {
  name: string;
  phone: string;
  email?: string;
  gender?: 'Homem' | 'Mulher' | 'Prefiro não dizer';
  notes?: string;
  isAnonymous?: boolean;
}

export interface Appointment {
  id: string;
  clientInfo: ClientInfo;
  serviceId: string;
  service: Service;
  date: string; // ISO date string
  time: string; // HH:MM format
  endTime: string; // calculated based on service duration
  status: AppointmentStatusType;
  createdAt: string;
  updatedAt: string;
  reminderSent?: boolean;
  whatsappConfirmation?: boolean;
  smsConfirmation?: boolean;
}

export interface CreateAppointmentRequest {
  clientInfo: ClientInfo;
  serviceId: string;
  date: string;
  time: string;
}

export interface UpdateAppointmentRequest {
  id: string;
  clientInfo?: Partial<ClientInfo>;
  serviceId?: string;
  date?: string;
  time?: string;
  status?: AppointmentStatusType;
}

export interface AppointmentFilters {
  date?: string;
  status?: AppointmentStatusType[];
  clientName?: string;
  serviceId?: string;
}

export interface AvailabilityRequest {
  date: string;
  serviceId: string;
}

export interface AvailabilityResponse {
  date: string;
  timeSlots: TimeSlot[];
  businessHours: {
    start: string;
    end: string;
  };
}

export interface AppointmentStatistics {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}