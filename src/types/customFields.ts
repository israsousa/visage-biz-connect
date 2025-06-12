export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'number' | 'email' | 'phone' | 'date' | 'time';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[]; // For select, multiselect, radio
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  category: 'personal' | 'medical' | 'preferences' | 'emergency' | 'custom';
  serviceTypes?: string[]; // Which services this field applies to
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldValue {
  fieldId: string;
  value: string | string[] | boolean | number;
}

export interface CustomFieldsData {
  [fieldId: string]: any;
}

// Predefined field templates for common use cases
export const FIELD_TEMPLATES: Partial<CustomField>[] = [
  {
    name: 'allergies',
    label: 'Alergias',
    type: 'textarea',
    category: 'medical',
    placeholder: 'Descreva quaisquer alergias ou sensibilidades...',
    helpText: 'Informe sobre alergias a produtos químicos, metais, etc.'
  },
  {
    name: 'skin_type',
    label: 'Tipo de Pele',
    type: 'select',
    category: 'medical',
    options: [
      { id: '1', label: 'Seca', value: 'dry' },
      { id: '2', label: 'Oleosa', value: 'oily' },
      { id: '3', label: 'Mista', value: 'combination' },
      { id: '4', label: 'Sensível', value: 'sensitive' },
      { id: '5', label: 'Normal', value: 'normal' }
    ]
  },
  {
    name: 'emergency_contact',
    label: 'Contacto de Emergência',
    type: 'phone',
    category: 'emergency',
    placeholder: '+351 XXX XXX XXX',
    helpText: 'Número de telefone para contactar em caso de emergência'
  },
  {
    name: 'emergency_contact_name',
    label: 'Nome do Contacto de Emergência',
    type: 'text',
    category: 'emergency',
    placeholder: 'Nome completo'
  },
  {
    name: 'medical_conditions',
    label: 'Condições Médicas',
    type: 'textarea',
    category: 'medical',
    placeholder: 'Diabetes, hipertensão, problemas cardíacos, etc.',
    helpText: 'Informe sobre condições médicas relevantes para o tratamento'
  },
  {
    name: 'medications',
    label: 'Medicamentos Atuais',
    type: 'textarea',
    category: 'medical',
    placeholder: 'Liste os medicamentos que está a tomar...',
    helpText: 'Inclua medicamentos com ou sem receita médica'
  },
  {
    name: 'preferred_therapist',
    label: 'Terapeuta Preferido',
    type: 'select',
    category: 'preferences',
    placeholder: 'Selecione o terapeuta preferido'
  },
  {
    name: 'communication_preference',
    label: 'Preferência de Comunicação',
    type: 'radio',
    category: 'preferences',
    options: [
      { id: '1', label: 'WhatsApp', value: 'whatsapp' },
      { id: '2', label: 'SMS', value: 'sms' },
      { id: '3', label: 'Email', value: 'email' },
      { id: '4', label: 'Telefone', value: 'phone' }
    ]
  },
  {
    name: 'birthday',
    label: 'Data de Nascimento',
    type: 'date',
    category: 'personal',
    helpText: 'Para ofertas especiais de aniversário'
  },
  {
    name: 'instagram_handle',
    label: 'Instagram',
    type: 'text',
    category: 'personal',
    placeholder: '@username',
    helpText: 'Para partilhas e marcações (opcional)'
  }
];

// Field categories for organization
export const FIELD_CATEGORIES = {
  personal: { 
    label: 'Informações Pessoais', 
    color: 'blue',
    icon: '👤'
  },
  medical: { 
    label: 'Informações Médicas', 
    color: 'red',
    icon: '⚕️'
  },
  preferences: { 
    label: 'Preferências', 
    color: 'purple',
    icon: '⚙️'
  },
  emergency: { 
    label: 'Contactos de Emergência', 
    color: 'orange',
    icon: '🚨'
  },
  custom: { 
    label: 'Personalizado', 
    color: 'green',
    icon: '🔧'
  }
} as const;