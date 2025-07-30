import React from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Event } from '../../types';

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Événements à venir</h3>
              <p className="text-sm text-gray-600">Aucun événement programmé</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Aucun événement</h4>
          <p className="text-gray-500">Aucun événement n'est programmé pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Événements à venir</h3>
              <p className="text-sm text-gray-600">{events.length} événement(s) programmé(s)</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir tout
          </button>
        </div>
      </div>
      
      {/* Liste des événements */}
      <div className="p-6 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="group p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                    {event.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    event.status === 'published' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status === 'confirmed' ? 'Confirmé' :
                     event.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(event.startDate), 'HH:mm', { locale: fr })} - {format(new Date(event.endDate), 'HH:mm', { locale: fr })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{event.assignments?.length || 0} technicien(s) assigné(s)</span>
                  </div>
                </div>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 