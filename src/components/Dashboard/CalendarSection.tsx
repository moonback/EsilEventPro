import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Event } from '../../types';
import { FullScreenCalendar } from '../Calendar/FullScreenCalendar';

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-3 w-3 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Calendrier des événements</h3>
              <p className="text-xs text-gray-600">{weeklyEvents} événements cette semaine</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Confirmés</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>En attente</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Calendrier avec mode plein écran */}
      <div className="p-4">
        <FullScreenCalendar
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          onDeleteEvent={onDeleteEvent}
          isFullScreen={isFullScreen}
          onToggleFullScreen={handleToggleFullScreen}
        />
      </div>
    </div>
  );
}; 