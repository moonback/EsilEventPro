import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Calendar, Clock, MapPin, Users, Save, X } from 'lucide-react';
import { EventFormData, TechnicianRequirement } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { format } from 'date-fns';

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {initialData ? 'Modifier l\'événement' : 'Nouvel événement'}
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
            <Controller
              name="startDate"
              control={control}
              rules={{ 
                required: 'Date de début requise',
                validate: (value) => {
                  if (!value) return 'Date de début requise';
                  const now = new Date();
                  if (value < now) {
                    return 'La date de début ne peut pas être dans le passé';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <input
                  type="datetime-local"
                  value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    field.onChange(newDate);
                    
                    // Mettre à jour automatiquement la date de fin si elle est antérieure
                    const endDate = watch('endDate');
                    if (endDate && newDate >= endDate) {
                      const newEndDate = new Date(newDate);
                      newEndDate.setHours(newEndDate.getHours() + 1);
                      setValue('endDate', newEndDate);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Date et heure de fin
            </label>
            <Controller
              name="endDate"
              control={control}
              rules={{ 
                required: 'Date de fin requise',
                validate: (value) => {
                  if (!value) return 'Date de fin requise';
                  const startDate = watch('startDate');
                  if (startDate && value <= startDate) {
                    return 'La date de fin doit être après la date de début';
                  }
                  return true;
                }
              }}
              render={({ field }) => (
                <input
                  type="datetime-local"
                  value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Techniciens requis */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              <Users className="inline h-4 w-4 mr-1" />
              Techniciens requis
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
            {requiredTechnicians?.map((req, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <select
                  value={req.skillId}
                  onChange={(e) => updateTechnicianRequirement(index, 'skillId', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={req.count}
                  onChange={(e) => updateTechnicianRequirement(index, 'count', parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nb"
                />

                <select
                  value={req.level}
                  onChange={(e) => updateTechnicianRequirement(index, 'level', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="expert">Expert</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeTechnicianRequirement(index)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {(!requiredTechnicians || requiredTechnicians.length === 0) && (
              <p className="text-sm text-gray-500 italic">
                Aucun technicien requis pour le moment
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};