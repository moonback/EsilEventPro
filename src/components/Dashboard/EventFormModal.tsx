import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Save, Plus } from 'lucide-react';
import { Event, EventFormData, EventType, TechnicianRequirement } from '../../types';
import { EventForm } from '../Events/EventForm';

interface EventFormModalProps {
  selectedEvent: Event | null;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  selectedEvent,
  onSubmit,
  onCancel,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onCancel, 200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal compact */}
      <div className={`relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden transition-transform duration-200 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        {/* Header compact */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedEvent ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedEvent ? 'Modifiez les détails de l\'événement' : 'Remplissez les informations de l\'événement'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <EventForm
            initialData={selectedEvent ? {
              title: selectedEvent.title,
              description: selectedEvent.description,
              startDate: selectedEvent.startDate,
              endDate: selectedEvent.endDate,
              location: selectedEvent.location,
              typeId: selectedEvent.type.id,
              requiredTechnicians: selectedEvent.requiredTechnicians,
            } : undefined}
            onSubmit={onSubmit}
            onCancel={handleClose}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
}; 