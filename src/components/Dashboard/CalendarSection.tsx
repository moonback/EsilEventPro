import React from 'react';
import { EventCalendar } from '../Calendar/EventCalendar';
import { Event } from '../../types';

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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Calendrier des événements</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Cette semaine: {weeklyEvents} événements</span>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <EventCalendar
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          onDeleteEvent={onDeleteEvent}
          height={400}
        />
      </div>
    </div>
  );
}; 