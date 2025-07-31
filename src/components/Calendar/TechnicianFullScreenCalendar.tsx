import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X, Calendar, Clock, MapPin, User } from 'lucide-react';
import { Event, Assignment } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TechnicianFullScreenCalendarProps {
  events: (Event & { assignment?: Assignment })[];
  onAcceptAssignment?: (assignment: Assignment) => void;
  onDeclineAssignment?: (assignment: Assignment, reason: string) => void;
  onDeleteEvent?: (event: Event) => void;
  onClose?: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const TechnicianFullScreenCalendar: React.FC<TechnicianFullScreenCalendarProps> = ({
  events,
  onAcceptAssignment,
  onDeclineAssignment,
  onDeleteEvent,
  onClose,
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(isFullScreen);
  const [selectedEvent, setSelectedEvent] = useState<(Event & { assignment?: Assignment }) | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    setIsFullScreenMode(isFullScreen);
  }, [isFullScreen]);

  const handleToggleFullScreen = () => {
    const newMode = !isFullScreenMode;
    setIsFullScreenMode(newMode);
    if (onToggleFullScreen) {
      onToggleFullScreen();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleAcceptAssignment = (assignment: Assignment) => {
    if (onAcceptAssignment) {
      onAcceptAssignment(assignment);
    }
  };

  const handleDeclineAssignment = (assignment: Assignment) => {
    if (onDeclineAssignment && declineReason.trim()) {
      onDeclineAssignment(assignment, declineReason);
      setDeclineReason('');
      setSelectedEvent(null);
    }
  };

  const getEventStatus = (event: Event & { assignment?: Assignment }) => {
    const eventDate = new Date(event.startDate);
    const now = new Date();
    
    if (eventDate < now) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-800' };
    }
    
    if (event.assignment?.status === 'accepted') {
      return { label: 'Accepté', color: 'bg-green-100 text-green-800' };
    }
    
    if (event.assignment?.status === 'declined') {
      return { label: 'Refusé', color: 'bg-red-100 text-red-800' };
    }
    
    return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
  };

  // Mode plein écran
  if (isFullScreenMode) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Mon Calendrier
            </h1>
            <div className="text-sm text-gray-500">
              Vue en plein écran - {events.length} événements
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleFullScreen}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Minimize2 className="h-5 w-5" />
              <span>Mode normal</span>
            </button>
            
            {onClose && (
              <button
                onClick={handleClose}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
                <span>Fermer</span>
              </button>
            )}
          </div>
        </div>

        {/* Calendrier en plein écran */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => {
              const status = getEventStatus(event);
              return (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {event.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.startDate), 'dd/MM/yyyy', { locale: fr })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.startDate), 'HH:mm', { locale: fr })} - {format(new Date(event.endDate), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-xs">{event.type.name}</span>
                    </div>
                  </div>
                  
                  {event.assignment && event.assignment.status === 'pending' && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptAssignment(event.assignment!);
                        }}
                        className="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal pour refuser un événement */}
        {selectedEvent && selectedEvent.assignment?.status === 'pending' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Refuser l'événement</h3>
              <p className="text-gray-600 mb-4">
                {selectedEvent.title}
              </p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Raison du refus (optionnel)"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
                rows={3}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setDeclineReason('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeclineAssignment(selectedEvent.assignment!)}
                  disabled={!declineReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode normal avec bouton pour passer en plein écran
  return (
    <div className="relative">
      {/* Bouton plein écran */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleToggleFullScreen}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg transition-colors"
        >
          <Maximize2 className="h-5 w-5" />
          <span>Plein écran</span>
        </button>
      </div>

      {/* Calendrier normal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0, 6).map((event) => {
            const status = getEventStatus(event);
            return (
              <div
                key={event.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {event.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(event.startDate), 'dd/MM', { locale: fr })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(event.startDate), 'HH:mm', { locale: fr })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 