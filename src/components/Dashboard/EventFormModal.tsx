import React from 'react';
import { Event, EventFormData, EventType } from '../../types';
import { EventForm } from '../Events/EventForm';
import { X } from 'lucide-react';

interface EventFormModalProps {
  selectedEvent: Event | null;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  eventTypes: EventType[];
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  selectedEvent,
  onSubmit,
  onCancel,
  isLoading = false,
  eventTypes,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  // Empêcher la fermeture si en cours de chargement
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content max-w-4xl w-full">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                {selectedEvent ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                {selectedEvent 
                  ? 'Modifiez les détails de votre événement'
                  : 'Planifiez un nouvel événement avec tous les détails nécessaires'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
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
            isLoading={isLoading}
            eventTypes={eventTypes}
          />
        </div>
      </div>
    </div>
  );
}; 