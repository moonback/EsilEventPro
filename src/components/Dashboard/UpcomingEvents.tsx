import React from 'react';
import { Event } from '../../types';
import { Calendar, Clock, MapPin, Users, Eye } from 'lucide-react';

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const getStatusColor = (status: string) => {
    const statusColors = {
      draft: 'bg-secondary-100 text-secondary-800',
      published: 'bg-warning-100 text-warning-800',
      confirmed: 'bg-success-100 text-success-800',
      completed: 'bg-primary-100 text-primary-800',
      cancelled: 'bg-error-100 text-error-800',
    };
    return statusColors[status as keyof typeof statusColors] || statusColors.draft;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (startDate: Date, endDate: Date) => {
    const duration = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Événements à venir</h2>
            <p className="text-sm text-secondary-600">Prochains événements dans les 7 jours</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">{events.length}</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">Aucun événement à venir</h3>
            <p className="text-secondary-500">Aucun événement n'est prévu dans les 7 prochains jours</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="group relative p-4 rounded-xl border border-secondary-200 hover:border-secondary-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-secondary-50/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  {/* Indicateur de type */}
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: event.type.color }}
                  />
                  
                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors duration-200 truncate">
                        {event.title}
                      </h3>
                      <span className={`badge ${getStatusColor(event.status)} ml-2 flex-shrink-0`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-secondary-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    {/* Détails */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="flex items-center space-x-1 text-secondary-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-secondary-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(event.startDate, event.endDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-secondary-500">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    
                    {/* Techniciens requis */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Users className="h-3 w-3 text-secondary-400" />
                      <span className="text-xs text-secondary-500">
                        {event.requiredTechnicians.length} technicien(s) requis
                      </span>
                    </div>
                  </div>
                  
                  {/* Bouton d'action */}
                  <button className="flex-shrink-0 p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
              </div>
            ))}
          </div>
        )}
        
        {/* Lien vers tous les événements */}
        {events.length > 0 && (
          <div className="mt-6 pt-4 border-t border-secondary-200">
            <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
              Voir tous les événements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 
