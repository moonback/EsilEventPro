import React from 'react';
import { Event, EventType } from '../../types';
import { Edit, Trash2, MoreVertical, Calendar, MapPin, Clock, Users } from 'lucide-react';

interface EventsTableProps {
  events: Event[];
  eventTypes: EventType[];
  selectedEvents: string[];
  onSelectEvent: (eventId: string) => void;
  onSelectAll: () => void;
  onDeleteEvent: (eventId: string) => void;
  onStatusChange: (eventId: string, newStatus: string) => void;
  statusMenuOpen: string | null;
  setStatusMenuOpen: (eventId: string | null) => void;
  getDateStatus: (date: Date) => { text: string; color: string };
}

export const EventsTable: React.FC<EventsTableProps> = ({
  events,
  eventTypes,
  selectedEvents,
  onSelectEvent,
  onSelectAll,
  onDeleteEvent,
  onStatusChange,
  statusMenuOpen,
  setStatusMenuOpen,
  getDateStatus,
}) => {
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      draft: 'badge-draft',
      published: 'badge-published',
      confirmed: 'badge-confirmed',
      completed: 'badge-completed',
      cancelled: 'badge-cancelled',
    };
    
    return (
      <span className={`badge ${statusClasses[status as keyof typeof statusClasses] || 'badge-draft'}`}>
        {status}
      </span>
    );
  };

  const getEventTypeColor = (typeId: string) => {
    const eventType = eventTypes.find(t => t.id === typeId);
    return eventType?.color || '#6b7280';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
    <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedEvents.length === events.length && events.length > 0}
                  onChange={onSelectAll}
                  className="form-checkbox"
                />
              </th>
              <th className="px-6 py-4">Événement</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Date & Heure</th>
              <th className="px-6 py-4">Lieu</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const isSelected = selectedEvents.includes(event.id);
              const dateStatus = getDateStatus(event.startDate);
              const eventType = eventTypes.find(t => t.id === event.type.id);
              
              return (
                <tr 
                  key={event.id} 
                  className={`transition-all duration-200 hover:bg-secondary-50/50 ${
                    isSelected ? 'bg-primary-50/30' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectEvent(event.id)}
                      className="form-checkbox"
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-2"
                        style={{ backgroundColor: getEventTypeColor(event.type.id) }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-secondary-900 truncate group-hover:text-primary-700 transition-colors duration-200">
                          {event.title}
                        </h3>
                        <p className="text-xs text-secondary-500 mt-1 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-xs text-secondary-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(event.startDate, event.endDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-secondary-400">
                            <Users className="h-3 w-3" />
                            <span>{event.requiredTechnicians.length} techniciens</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: eventType?.color || '#6b7280' }}
                      />
                      <span className="text-sm font-medium text-secondary-700">
                        {eventType?.name || 'Inconnu'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-secondary-400" />
                        <span className="text-sm font-medium text-secondary-900">
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-secondary-400" />
                        <span className="text-xs text-secondary-500">
                          {event.startDate.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {event.endDate.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      {dateStatus.text && (
                        <span 
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${dateStatus.color}20`, 
                            color: dateStatus.color 
                          }}
                        >
                          {dateStatus.text}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm text-secondary-700 truncate max-w-32">
                        {event.location}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {getStatusBadge(event.status)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setStatusMenuOpen(statusMenuOpen === event.id ? null : event.id)}
                        className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-all duration-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {statusMenuOpen === event.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-secondary-200 z-50 animate-scale-in">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                // Action pour éditer
                                setStatusMenuOpen(null);
                              }}
                              className="dropdown-item"
                            >
                              <Edit className="h-4 w-4" />
                              <span>Modifier</span>
                            </button>
                            <button
                              onClick={() => {
                                onDeleteEvent(event.id);
                                setStatusMenuOpen(null);
                              }}
                              className="dropdown-item text-error-600 hover:bg-error-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">Aucun événement</h3>
          <p className="text-secondary-500">Commencez par créer votre premier événement</p>
        </div>
      )}
    </div>
  );
}; 