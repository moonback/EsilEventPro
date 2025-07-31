import React, { useState, useEffect } from 'react';
import { EventFormData, TechnicianRequirement, EventType } from '../../types';
import { Calendar, MapPin, Clock, Users, Plus, X, Trash2 } from 'lucide-react';

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  eventTypes: EventType[];
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  eventTypes,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2h par défaut
    location: '',
    typeId: '',
    requiredTechnicians: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Le lieu est requis';
    }

    if (!formData.typeId) {
      newErrors.typeId = 'Le type d\'événement est requis';
    }

    if (formData.startDate >= formData.endDate) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
    }

    if (formData.requiredTechnicians.length === 0) {
      newErrors.requiredTechnicians = 'Au moins un technicien est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTechnicianRequirement = () => {
    const newRequirement: TechnicianRequirement = {
      skillId: '',
      count: 1,
      level: 'beginner',
    };
    setFormData(prev => ({
      ...prev,
      requiredTechnicians: [...prev.requiredTechnicians, newRequirement],
    }));
  };

  const removeTechnicianRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredTechnicians: prev.requiredTechnicians.filter((_, i) => i !== index),
    }));
  };

  const updateTechnicianRequirement = (index: number, field: keyof TechnicianRequirement, value: any) => {
    setFormData(prev => ({
      ...prev,
      requiredTechnicians: prev.requiredTechnicians.map((req, i) =>
        i === index ? { ...req, [field]: value } : req
      ),
    }));
  };

  const selectedEventType = eventTypes.find(t => t.id === formData.typeId);

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-secondary-900">Informations de base</h2>
            <p className="text-sm text-secondary-600 mt-1">Définissez les détails principaux de votre événement</p>
          </div>
          <div className="card-body space-y-6">
            {/* Titre */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Titre de l'événement *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`form-input ${errors.title ? 'border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Ex: Concert de jazz au Sunset"
              />
              {errors.title && (
                <p className="text-sm text-error-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`form-textarea ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
                rows={4}
                placeholder="Décrivez votre événement..."
              />
              {errors.description && (
                <p className="text-sm text-error-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Type d'événement */}
            <div className="form-group">
              <label htmlFor="typeId" className="form-label">
                Type d'événement *
              </label>
              <select
                id="typeId"
                value={formData.typeId}
                onChange={(e) => handleInputChange('typeId', e.target.value)}
                className={`form-select ${errors.typeId ? 'border-error-500 focus:ring-error-500' : ''}`}
              >
                <option value="">Sélectionnez un type</option>
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.typeId && (
                <p className="text-sm text-error-600 mt-1">{errors.typeId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date et lieu */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-secondary-900">Date et lieu</h2>
            <p className="text-sm text-secondary-600 mt-1">Planifiez quand et où se déroulera l'événement</p>
          </div>
          <div className="card-body space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date de début */}
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  Date et heure de début *
                </label>
                <input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate.toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
                  className="form-input"
                />
              </div>

              {/* Date de fin */}
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  Date et heure de fin *
                </label>
                <input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate.toISOString().slice(0, 16)}
                  onChange={(e) => handleInputChange('endDate', new Date(e.target.value))}
                  className={`form-input ${errors.endDate ? 'border-error-500 focus:ring-error-500' : ''}`}
                />
                {errors.endDate && (
                  <p className="text-sm text-error-600 mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Lieu */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Lieu de l'événement *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`form-input pl-10 ${errors.location ? 'border-error-500 focus:ring-error-500' : ''}`}
                  placeholder="Ex: Salle de concert, 123 Rue de la Musique, Paris"
                />
              </div>
              {errors.location && (
                <p className="text-sm text-error-600 mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* Besoins en techniciens */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-secondary-900">Besoins en techniciens</h2>
            <p className="text-sm text-secondary-600 mt-1">Définissez les compétences requises pour cet événement</p>
          </div>
          <div className="card-body space-y-6">
            {formData.requiredTechnicians.map((requirement, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-4 bg-secondary-50/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-secondary-900">
                    Technicien {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeTechnicianRequirement(index)}
                    className="p-1 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Compétence */}
                  <div className="form-group">
                    <label className="form-label">Compétence</label>
                    <select
                      value={requirement.skillId}
                      onChange={(e) => updateTechnicianRequirement(index, 'skillId', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Sélectionnez une compétence</option>
                      <option value="sound">Son</option>
                      <option value="lighting">Éclairage</option>
                      <option value="video">Vidéo</option>
                      <option value="stage">Scène</option>
                    </select>
                  </div>

                  {/* Nombre */}
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input
                      type="number"
                      min="1"
                      value={requirement.count}
                      onChange={(e) => updateTechnicianRequirement(index, 'count', parseInt(e.target.value))}
                      className="form-input"
                    />
                  </div>

                  {/* Niveau */}
                  <div className="form-group">
                    <label className="form-label">Niveau requis</label>
                    <select
                      value={requirement.level}
                      onChange={(e) => updateTechnicianRequirement(index, 'level', e.target.value)}
                      className="form-select"
                    >
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTechnicianRequirement}
              className="btn btn-secondary w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un technicien
            </button>

            {errors.requiredTechnicians && (
              <p className="text-sm text-error-600">{errors.requiredTechnicians}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner spinner-sm mr-2" />
                Création...
              </>
            ) : (
              'Créer l\'événement'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};