import { z } from 'zod';

export const clientInfoSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  phone: z.string()
    .min(6, 'Telefone deve ter pelo menos 6 dígitos')
    .regex(
      /^(\+[1-9]\d{4,18}|00[1-9]\d{4,18}|\d{6,15})$/, 
      'Formato de telefone inválido'
    )
    .transform((val) => {
      // Remove espaços, traços, parênteses e pontos
      const cleaned = val.replace(/[\s\-\(\)\.]/g, '');
      
      // Se não tem código de país, adiciona +351 (Portugal)
      if (!/^\+/.test(cleaned) && !/^00/.test(cleaned)) {
        return `+351${cleaned}`;
      }
      
      // Convert 00 prefix to +
      if (/^00/.test(cleaned)) {
        return `+${cleaned.substring(2)}`;
      }
      
      return cleaned;
    }),
  
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  gender: z.enum(['Homem', 'Mulher', 'Prefiro não dizer'])
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(500, 'Notas não podem ter mais de 500 caracteres')
    .optional()
});

export const createAppointmentSchema = z.object({
  clientInfo: clientInfoSchema,
  serviceId: z.string()
    .min(1, 'Por favor selecione um serviço'),
  
  date: z.string()
    .min(1, 'Por favor selecione uma data')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'A data deve ser hoje ou no futuro'),
  
  time: z.string()
    .min(1, 'Por favor selecione um horário')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido')
});

export const updateAppointmentSchema = z.object({
  id: z.string().min(1, 'ID do agendamento é obrigatório'),
  clientInfo: clientInfoSchema.partial().optional(),
  serviceId: z.string().optional(),
  date: z.string().optional(),
  time: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de horário inválido')
    .optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).optional()
});

export const appointmentFiltersSchema = z.object({
  date: z.string().optional(),
  status: z.array(z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])).optional(),
  clientName: z.string().optional(),
  serviceId: z.string().optional()
});

export const availabilityRequestSchema = z.object({
  date: z.string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'A data deve ser hoje ou no futuro'),
  
  serviceId: z.string()
    .min(1, 'ID do serviço é obrigatório')
});

// Form types derived from schemas
export type ClientInfoForm = z.infer<typeof clientInfoSchema>;
export type CreateAppointmentForm = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentForm = z.infer<typeof updateAppointmentSchema>;
export type AppointmentFiltersForm = z.infer<typeof appointmentFiltersSchema>;
export type AvailabilityRequestForm = z.infer<typeof availabilityRequestSchema>;