import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { EventCalendar } from './EventCalendar';
import { Event } from '../../types';

interface FullScreenCalendarProps {
  onSelectEvent?: (event: Event) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onDeleteEvent?: (event: Event) => void;
  onClose?: () => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const FullScreenCalendar: React.FC<FullScreenCalendarProps> = ({
  onSelectEvent,
  onSelectSlot,
  onDeleteEvent,
  onClose,
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(isFullScreen);

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

  // Mode plein écran
  if (isFullScreenMode) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Calendrier des événements
            </h1>
            <div className="text-sm text-gray-500">
              Vue en plein écran
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
        <div className="flex-1 overflow-hidden">
          <EventCalendar
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
            onDeleteEvent={onDeleteEvent}
            height={window.innerHeight - 100} // Hauteur dynamique
          />
        </div>
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
      <EventCalendar
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onDeleteEvent={onDeleteEvent}
        height={700}
      />
    </div>
  );
}; 