import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, Clock, MapPin, Users, Save, X, Euro, Target } from 'lucide-react';
import { EventFormData, TechnicianRequirement } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { format } from 'date-fns';
import { MissionPricingForm } from './MissionPricingForm';
import { TechnicianSelection } from './TechnicianSelection';

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { eventTypes, skills } = useAppStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<'details' | 'pricing' | 'technicians'>('details');
  const [pricing, setPricing] = useState({
    basePrice: initialData?.pricing?.basePrice || 50,
    pricePerHour: initialData?.pricing?.pricePerHour || 25,
    bonusPercentage: initialData?.pricing?.bonusPercentage || 10,
  });
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>(
    initialData?.targetedTechnicians || []
  );
  const [selectionReasons, setSelectionReasons] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(),
      location: initialData?.location || '',
      typeId: initialData?.typeId || eventTypes[0]?.id || '',
      requiredTechnicians: initialData?.requiredTechnicians || [],
    },
  });

  const requiredTechnicians = watch('requiredTechnicians');
  const formData = watch();

  const addTechnicianRequirement = () => {
    const current = requiredTechnicians || [];
    setValue('requiredTechnicians', [
      ...current,
      { skillId: skills[0]?.id || '', count: 1, level: 'intermediate' },
    ]);
  };

  const removeTechnicianRequirement = (index: number) => {
    const current = requiredTechnicians || [];
    setValue('requiredTechnicians', current.filter((_, i) => i !== index));
  };

  const updateTechnicianRequirement = (index: number, field: keyof TechnicianRequirement, value: any) => {
    const current = requiredTechnicians || [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    setValue('requiredTechnicians', updated);
  };

  const handleSelectionReasonChange = (technicianId: string, reason: string) => {
    setSelectionReasons(prev => ({
      ...prev,
      [technicianId]: reason,
    }));
  };

  const handleFormSubmit = (data: EventFormData) => {
    // Convertir les chaînes de dates en objets Date
    const finalData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      pricing,
      targetedTechnicians: selectedTechnicians,
    };
    onSubmit(finalData);
  };

  const nextStep = () => {
    if (currentStep === 'details') setCurrentStep('pricing');
    else if (currentStep === 'pricing') setCurrentStep('technicians');
  };

  const prevStep = () => {
    if (currentStep === 'technicians') setCurrentStep('pricing');
    else if (currentStep === 'pricing') setCurrentStep('details');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 ${currentStep === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-sm font-medium">Détails</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep === 'pricing' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'pricing' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-sm font-medium">Tarification</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep === 'technicians' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'technicians' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-sm font-medium">Techniciens</span>
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'événement
          </label>
          <input
            {...register('title', { required: 'Titre requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom de l'événement"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'événement
          </label>
          <select
            {...register('typeId', { required: 'Type requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {eventTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description de l'événement..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Lieu
        </label>
        <input
          {...register('location', { required: 'Lieu requis' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Adresse du lieu"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date et heure de début
          </label>
          <input
            type="datetime-local"
            {...register('startDate', { required: 'Date de début requise' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Date et heure de fin
          </label>
          <input
            type="datetime-local"
            {...register('endDate', { required: 'Date de fin requise' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Exigences en techniciens */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <Users className="inline h-4 w-4 mr-1" />
            Exigences en techniciens
          </label>
          <button
            type="button"
            onClick={addTechnicianRequirement}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ajouter
          </button>
        </div>

        <div className="space-y-3">
          {requiredTechnicians?.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <select
                value={requirement.skillId}
                onChange={(e) => updateTechnicianRequirement(index, 'skillId', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={requirement.count}
                onChange={(e) => updateTechnicianRequirement(index, 'count', parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nb"
              />

              <select
                value={requirement.level}
                onChange={(e) => updateTechnicianRequirement(index, 'level', e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="expert">Expert</option>
              </select>

              <button
                type="button"
                onClick={() => removeTechnicianRequirement(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPricingStep = () => (
    <MissionPricingForm
      pricing={pricing}
      onPricingChange={setPricing}
      eventData={formData}
    />
  );

  const renderTechniciansStep = () => (
    <TechnicianSelection
      event={{
        id: '',
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        type: eventTypes.find(t => t.id === formData.typeId) || eventTypes[0],
        requiredTechnicians: formData.requiredTechnicians || [],
        assignments: [],
        status: 'draft',
        createdBy: user?.id || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
      selectedTechnicians={selectedTechnicians}
      onTechniciansChange={setSelectedTechnicians}
      onSelectionReasonChange={handleSelectionReasonChange}
    />
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {initialData ? 'Modifier l\'événement' : 'Nouvel événement'}
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        {renderStepIndicator()}

        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'pricing' && renderPricingStep()}
        {currentStep === 'technicians' && renderTechniciansStep()}

        {/* Boutons de navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {currentStep !== 'details' && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Précédent
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Annuler
            </button>
          </div>

          <div className="flex space-x-3">
            {currentStep !== 'technicians' ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Création...' : 'Créer l\'événement'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};