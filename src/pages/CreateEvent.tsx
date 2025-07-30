import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from '../components/Events/EventForm';
import { EventFormData } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent, eventTypes } = useAppStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const eventType = eventTypes.find(t => t.id === data.typeId);
      if (!eventType || !user) {
        toast.error('Erreur lors de la création de l\'événement');
        return;
      }

      const newEvent = {
        ...data,
        type: eventType,
        assignments: [],
        status: 'draft' as const,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addEvent(newEvent);
      toast.success('Événement créé avec succès !');
      navigate('/admin/events');
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      toast.error('Erreur lors de la création de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Nouvel Événement</h1>
              <p className="text-gray-600 mt-2">Créez un nouvel événement pour votre organisation</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-sm border">
          <EventForm
            initialData={{
              title: '',
              description: '',
              startDate: new Date(),
              endDate: new Date(Date.now() + 60 * 60 * 1000), // +1 heure
              location: '',
              typeId: eventTypes[0]?.id || '',
              requiredTechnicians: [],
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 