import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CustomField, FieldType, FIELD_TEMPLATES } from '@/types/customFields';

interface CustomFieldsContextType {
  // State
  customFields: CustomField[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  createField: (fieldData: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CustomField>;
  updateField: (id: string, fieldData: Partial<CustomField>) => Promise<CustomField>;
  deleteField: (id: string) => Promise<void>;
  getField: (id: string) => CustomField | undefined;
  getFieldsByCategory: (category: string) => CustomField[];
  getFieldsByService: (serviceId: string) => CustomField[];
  
  // Field management
  reorderFields: (fieldIds: string[]) => Promise<void>;
  toggleFieldStatus: (id: string) => Promise<void>;
  createFromTemplate: (templateIndex: number, serviceTypes?: string[]) => Promise<CustomField>;
  
  // Utility
  refreshFields: () => Promise<void>;
  clearError: () => void;
}

const CustomFieldsContext = createContext<CustomFieldsContextType | undefined>(undefined);

// Mock data - in a real app, this would come from an API/database
const defaultCustomFields: CustomField[] = [
  {
    id: '1',
    name: 'allergies',
    label: 'Alergias',
    type: 'textarea',
    required: false,
    category: 'medical',
    placeholder: 'Descreva quaisquer alergias ou sensibilidades...',
    helpText: 'Informe sobre alergias a produtos químicos, metais, etc.',
    serviceTypes: ['service-1', 'service-3'], // Hair and Facial services
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'skin_type',
    label: 'Tipo de Pele',
    type: 'select',
    required: false,
    category: 'medical',
    options: [
      { id: '1', label: 'Seca', value: 'dry' },
      { id: '2', label: 'Oleosa', value: 'oily' },
      { id: '3', label: 'Mista', value: 'combination' },
      { id: '4', label: 'Sensível', value: 'sensitive' },
      { id: '5', label: 'Normal', value: 'normal' }
    ],
    serviceTypes: ['service-3'], // Facial services only
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'communication_preference',
    label: 'Preferência de Comunicação',
    type: 'radio',
    required: false,
    category: 'preferences',
    options: [
      { id: '1', label: 'WhatsApp', value: 'whatsapp' },
      { id: '2', label: 'SMS', value: 'sms' },
      { id: '3', label: 'Email', value: 'email' },
      { id: '4', label: 'Telefone', value: 'phone' }
    ],
    serviceTypes: [], // All services
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const CustomFieldsProvider = ({ children }: { children: ReactNode }) => {
  const [customFields, setCustomFields] = useState<CustomField[]>(defaultCustomFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createField = useCallback(async (fieldData: Omit<CustomField, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomField> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const newField: CustomField = {
        ...fieldData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCustomFields(prev => [...prev, newField].sort((a, b) => a.order - b.order));
      return newField;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create field';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateField = useCallback(async (id: string, fieldData: Partial<CustomField>): Promise<CustomField> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const existingField = customFields.find(field => field.id === id);
      if (!existingField) {
        throw new Error('Field not found');
      }

      const updatedField: CustomField = {
        ...existingField,
        ...fieldData,
        updatedAt: new Date().toISOString(),
      };

      setCustomFields(prev => prev.map(field => field.id === id ? updatedField : field));
      return updatedField;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update field';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [customFields]);

  const deleteField = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCustomFields(prev => prev.filter(field => field.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete field';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getField = useCallback((id: string): CustomField | undefined => {
    return customFields.find(field => field.id === id);
  }, [customFields]);

  const getFieldsByCategory = useCallback((category: string): CustomField[] => {
    return customFields.filter(field => field.category === category && field.isActive)
      .sort((a, b) => a.order - b.order);
  }, [customFields]);

  const getFieldsByService = useCallback((serviceId: string): CustomField[] => {
    return customFields.filter(field => 
      field.isActive && 
      (field.serviceTypes?.length === 0 || field.serviceTypes?.includes(serviceId))
    ).sort((a, b) => a.order - b.order);
  }, [customFields]);

  const reorderFields = useCallback(async (fieldIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      setCustomFields(prev => 
        prev.map(field => {
          const newOrder = fieldIds.indexOf(field.id);
          return newOrder >= 0 ? { ...field, order: newOrder, updatedAt: new Date().toISOString() } : field;
        }).sort((a, b) => a.order - b.order)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder fields';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFieldStatus = useCallback(async (id: string): Promise<void> => {
    const field = customFields.find(f => f.id === id);
    if (!field) return;

    await updateField(id, { isActive: !field.isActive });
  }, [customFields, updateField]);

  const createFromTemplate = useCallback(async (templateIndex: number, serviceTypes: string[] = []): Promise<CustomField> => {
    const template = FIELD_TEMPLATES[templateIndex];
    if (!template) {
      throw new Error('Template not found');
    }

    const maxOrder = Math.max(...customFields.map(f => f.order), 0);

    return createField({
      name: template.name || '',
      label: template.label || '',
      type: template.type || 'text',
      required: false,
      category: template.category || 'custom',
      placeholder: template.placeholder,
      helpText: template.helpText,
      options: template.options,
      serviceTypes,
      isActive: true,
      order: maxOrder + 1,
    });
  }, [customFields, createField]);

  const refreshFields = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would fetch from API
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: CustomFieldsContextType = {
    customFields,
    loading,
    error,
    createField,
    updateField,
    deleteField,
    getField,
    getFieldsByCategory,
    getFieldsByService,
    reorderFields,
    toggleFieldStatus,
    createFromTemplate,
    refreshFields,
    clearError,
  };

  return (
    <CustomFieldsContext.Provider value={value}>
      {children}
    </CustomFieldsContext.Provider>
  );
};

export const useCustomFields = () => {
  const context = useContext(CustomFieldsContext);
  if (!context) {
    throw new Error('useCustomFields must be used within a CustomFieldsProvider');
  }
  return context;
};