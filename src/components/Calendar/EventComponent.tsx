import React from 'react';
import { format } from 'date-fns';
import { Clock, MapPin, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../../types';

interface EventComponentProps {
  event: CalendarEvent;
  onDeleteEvent?: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export const EventComponent: React.FC<EventComponentProps> = ({ event, onDeleteEvent }) => {
  const startTime = format(event.start, 'HH:mm');
  const endTime = format(event.end, 'HH:mm');
  const isAllDay = event.start.getHours() === 0 && event.start.getMinutes() === 0 && 
                   event.end.getHours() === 0 && event.end.getMinutes() === 0;
  const { resource } = event;
  
  return (
    <div className="event-item">
      {/* Titre de l'événement */}
      <div className="event-title truncate">
        {event.title}
      </div>
      
      {/* Heures */}
      {!isAllDay && (
        <div className="event-time flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {startTime} - {endTime}
        </div>
      )}
      
      {/* Emplacement */}
      {resource.location && (
        <div className="event-location flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{resource.location}</span>
        </div>
      )}
      
      {/* Statut */}
      <div className="event-status">
        <span className={`inline-block px-1 py-0.5 rounded text-xs font-medium ${
          resource.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          resource.status === 'published' ? 'bg-blue-100 text-blue-800' :
          resource.status === 'draft' ? 'bg-gray-100 text-gray-800' :
          resource.status === 'completed' ? 'bg-purple-100 text-purple-800' :
          'bg-red-100 text-red-800'
        }`}>
          {resource.status === 'confirmed' ? 'Confirmé' :
           resource.status === 'published' ? 'Publié' :
           resource.status === 'draft' ? 'Brouillon' :
           resource.status === 'completed' ? 'Terminé' :
           'Annulé'}
        </span>
      </div>
      
      {/* Bouton de suppression */}
      {onDeleteEvent && (
        <button
          onClick={(e) => onDeleteEvent(event, e)}
          className="absolute top-1 right-1 p-0.5 text-white hover:text-red-200 hover:bg-red-600/20 rounded transition-colors opacity-0 group-hover:opacity-100"
          title="Supprimer l'événement"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}; 