import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Event } from '../../types';

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Événements à venir</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(event.startDate), 'dd MMM', { locale: fr })}</span>
                  <MapPin className="h-3 w-3 ml-2" />
                  <span>{event.location}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                event.status === 'published' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status === 'confirmed' ? 'Confirmé' :
                 event.status === 'published' ? 'Publié' : 'Brouillon'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 