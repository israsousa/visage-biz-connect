import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Settings, Lightbulb } from 'lucide-react';
import { useCustomFields } from '@/contexts/CustomFieldsContext';
import { CustomField, FIELD_CATEGORIES, FIELD_TEMPLATES } from '@/types/customFields';
import { useToast } from '@/components/ui/use-toast';

const CustomFields = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);

  const { 
    customFields, 
    loading, 
    deleteField, 
    toggleFieldStatus,
    createFromTemplate,
    getFieldsByCategory 
  } = useCustomFields();
  
  const { toast } = useToast();

  const filteredFields = selectedCategory === 'all' 
    ? customFields 
    : getFieldsByCategory(selectedCategory);

  const handleDeleteField = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este campo?')) {
      try {
        await deleteField(id);
        toast({
          title: 'Campo eliminado',
          description: 'O campo personalizado foi removido com sucesso.',
        });
      } catch (error) {
        toast({
          title: 'Erro ao eliminar campo',
          description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleFieldStatus(id);
      const field = customFields.find(f => f.id === id);
      toast({
        title: field?.isActive ? 'Campo desativado' : 'Campo ativado',
        description: `O campo foi ${field?.isActive ? 'desativado' : 'ativado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao alterar status',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  const handleCreateFromTemplate = async (templateIndex: number) => {
    try {
      await createFromTemplate(templateIndex);
      toast({
        title: 'Campo criado',
        description: 'Novo campo personalizado criado a partir do modelo.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar campo',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    }
  };

  const getFieldTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      text: 'Texto',
      textarea: 'Área de Texto',
      select: 'Seleção',
      multiselect: 'Seleção Múltipla',
      checkbox: 'Checkbox',
      radio: 'Botões de Rádio',
      number: 'Número',
      email: 'Email',
      phone: 'Telefone',
      date: 'Data',
      time: 'Hora'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Campos Personalizados</h1>
            <p className="text-purple-100">Gerir campos personalizados para agendamentos</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setEditingField({} as CustomField)}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Campo
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Modelos
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Templates Section */}
        {showTemplates && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Modelos Predefinidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FIELD_TEMPLATES.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.label}</h4>
                      <p className="text-sm text-gray-500">{getFieldTypeLabel(template.type || 'text')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.category === 'medical' ? 'bg-red-100 text-red-700' :
                      template.category === 'personal' ? 'bg-blue-100 text-blue-700' :
                      template.category === 'preferences' ? 'bg-purple-100 text-purple-700' :
                      template.category === 'emergency' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {FIELD_CATEGORIES[template.category || 'custom'].label}
                    </span>
                  </div>
                  {template.helpText && (
                    <p className="text-xs text-gray-600 mb-3">{template.helpText}</p>
                  )}
                  <button
                    onClick={() => handleCreateFromTemplate(index)}
                    className="w-full py-2 px-3 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    Usar Modelo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Categoria</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {Object.entries(FIELD_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === key
                    ? (key === 'medical' ? 'bg-red-100 text-red-700' :
                       key === 'personal' ? 'bg-blue-100 text-blue-700' :
                       key === 'preferences' ? 'bg-purple-100 text-purple-700' :
                       key === 'emergency' ? 'bg-orange-100 text-orange-700' :
                       'bg-green-100 text-green-700')
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fields List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Campos Personalizados ({filteredFields.length})
            </h3>
          </div>

          {filteredFields.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum campo encontrado</h4>
              <p className="text-gray-500 mb-4">
                {selectedCategory === 'all' 
                  ? 'Crie o seu primeiro campo personalizado.' 
                  : 'Não há campos nesta categoria.'}
              </p>
              <button
                onClick={() => setEditingField({} as CustomField)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Criar Campo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  className={`border rounded-xl p-4 transition-all ${
                    field.isActive 
                      ? 'border-gray-200 hover:border-purple-300' 
                      : 'border-gray-100 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{field.label}</h4>
                          {field.required && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              Obrigatório
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            field.category === 'medical' ? 'bg-red-100 text-red-700' :
                            field.category === 'personal' ? 'bg-blue-100 text-blue-700' :
                            field.category === 'preferences' ? 'bg-purple-100 text-purple-700' :
                            field.category === 'emergency' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {FIELD_CATEGORIES[field.category].label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Tipo: {getFieldTypeLabel(field.type)}</span>
                          {field.serviceTypes && field.serviceTypes.length > 0 && (
                            <span>Serviços: {field.serviceTypes.length}</span>
                          )}
                        </div>
                        {field.helpText && (
                          <p className="text-xs text-gray-600 mt-1">{field.helpText}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(field.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          field.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={field.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {field.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingField(field)}
                        className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteField(field.id)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomFields;