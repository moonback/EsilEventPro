import React from 'react';
import { Calendar, MapPin, Users, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Event, EventType } from '../../types';
import { EventStatusDropdown } from './EventStatusDropdown';

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
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-visible">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedEvents.length === events.length && events.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Événement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affectations
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => {
              const eventType = eventTypes.find(t => t.id === event.type.id);
              const eventAssignments = event.assignments || [];
              const dateStatus = getDateStatus(new Date(event.startDate));
              
              return (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => onSelectEvent(event.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div 
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: eventType?.color + '20', color: eventType?.color }}
                        >
                          <Calendar className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-2 w-2 rounded-full mr-2"
                        style={{ backgroundColor: eventType?.color }}
                      />
                      <span className="text-sm text-gray-900">{eventType?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(event.startDate), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                    <div className={`text-xs ${dateStatus.color}`}>
                      {dateStatus.text}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EventStatusDropdown
                      eventId={event.id}
                      currentStatus={event.status}
                      isOpen={statusMenuOpen === event.id}
                      onToggle={() => setStatusMenuOpen(statusMenuOpen === event.id ? null : event.id)}
                      onStatusChange={onStatusChange}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {eventAssignments.length} technicien(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Message si aucun événement */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun événement trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer votre premier événement.
          </p>
        </div>
      )}
    </div>
  );
}; 