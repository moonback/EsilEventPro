import React from 'react';
import { Calendar } from 'lucide-react';
import { EventForm } from '../Events/EventForm';
import { Event, EventFormData } from '../../types';

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
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h1>
              <p className="text-blue-100 text-lg">Créez ou modifiez un événement</p>
            </div>
          </div>
        </div>
      </div>

      <EventForm
        initialData={selectedEvent ? {
          title: selectedEvent.title,
          description: selectedEvent.description,
          startDate: new Date(selectedEvent.startDate),
          endDate: new Date(selectedEvent.endDate),
          location: selectedEvent.location,
          typeId: selectedEvent.type.id,
          requiredTechnicians: selectedEvent.requiredTechnicians,
        } : undefined}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}; 