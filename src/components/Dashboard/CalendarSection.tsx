import React from 'react';
import { Event } from '../../types';
import { Calendar, Plus, Eye, Edit, Trash2 } from 'lucide-react';

interface CalendarSectionProps {
  weeklyEvents: number;
  onSelectEvent: (event: Event) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onDeleteEvent: (event: Event) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  weeklyEvents,
  onSelectEvent,
  onSelectSlot,
  onDeleteEvent,
}) => {
  // Simuler des événements pour la démonstration
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Concert de jazz',
      description: 'Concert de jazz au Sunset',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 jours
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3h
      location: 'Salle de concert Sunset',
      type: { id: '1', name: 'Concert', color: '#3b82f6', defaultDuration: 3 },
      requiredTechnicians: [],
      assignments: [],
      status: 'confirmed',
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Conférence tech',
      description: 'Conférence sur les nouvelles technologies',
      startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // +4 jours
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2h
      location: 'Centre de conférences',
      type: { id: '2', name: 'Conférence', color: '#10b981', defaultDuration: 2 },
      requiredTechnicians: [],
      assignments: [],
      status: 'published',
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

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
    <div className="space-y-6">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Calendrier des événements</h3>
            <p className="text-sm text-secondary-600">{weeklyEvents} événements cette semaine</p>
          </div>
        </div>
        <button
          onClick={() => onSelectSlot({ start: new Date(), end: new Date() })}
          className="btn btn-primary btn-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </button>
      </div>

      {/* Vue calendrier simplifiée */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event, index) => (
          <div
            key={event.id}
            className="group relative p-4 rounded-xl border border-secondary-200 hover:border-secondary-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-secondary-50/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Indicateur de type */}
            <div 
              className="w-3 h-3 rounded-full mb-3"
              style={{ backgroundColor: event.type.color }}
            />
            
            {/* Contenu principal */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors duration-200">
                  {event.title}
                </h4>
                <span className={`badge ${getStatusColor(event.status)} ml-2 flex-shrink-0`}>
                  {event.status}
                </span>
              </div>
              
              <p className="text-xs text-secondary-600 line-clamp-2">
                {event.description}
              </p>
              
              {/* Détails */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-secondary-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-500">
                  <span className="w-3 h-3 rounded-full bg-primary-500" />
                  <span>{formatDuration(event.startDate, event.endDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-500">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: event.type.color }} />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-secondary-100">
              <button
                onClick={() => onSelectEvent(event)}
                className="p-1 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-200"
                title="Voir les détails"
              >
                <Eye className="h-3 w-3" />
              </button>
              <button
                onClick={() => onSelectEvent(event)}
                className="p-1 text-secondary-400 hover:text-warning-600 hover:bg-warning-50 rounded transition-all duration-200"
                title="Modifier"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDeleteEvent(event)}
                className="p-1 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded transition-all duration-200"
                title="Supprimer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
            
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
          </div>
        ))}
        
        {/* Carte pour créer un nouvel événement */}
        <button
          onClick={() => onSelectSlot({ start: new Date(), end: new Date() })}
          className="group relative p-4 rounded-xl border-2 border-dashed border-secondary-300 hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 bg-white hover:shadow-md"
        >
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-200">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors duration-200">
                Nouvel événement
              </h4>
              <p className="text-xs text-secondary-500 group-hover:text-primary-600 transition-colors duration-200">
                Cliquez pour créer
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Message si aucun événement */}
      {mockEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">Aucun événement</h3>
          <p className="text-secondary-500 mb-4">Commencez par créer votre premier événement</p>
          <button
            onClick={() => onSelectSlot({ start: new Date(), end: new Date() })}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un événement
          </button>
        </div>
      )}
    </div>
  );
}; 