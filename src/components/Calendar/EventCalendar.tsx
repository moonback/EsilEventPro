import React, { useMemo } from 'react';
import { Event, CalendarEvent } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { CalendarStats } from './CalendarStats';
import { CalendarContainer } from './CalendarContainer';
import { CalendarLegend } from './CalendarLegend';
import { CalendarTips } from './CalendarTips';

interface EventCalendarProps {
  onSelectEvent?: (event: Event) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onDeleteEvent?: (event: Event) => void;
  height?: number;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  onSelectEvent,
  onSelectSlot,
  onDeleteEvent,
  height = 700,
}) => {
  const { events } = useAppStore();

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      resource: event,
    }));
  }, [events]);

  const handleSelectEvent = (calendarEvent: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(calendarEvent.resource);
    }
  };

  const handleDeleteEvent = (calendarEvent: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(calendarEvent.resource);
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <CalendarStats events={events} />

      {/* Calendrier */}
      <CalendarContainer
        events={calendarEvents}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onDeleteEvent={handleDeleteEvent}
        height={height}
      />
      
      {/* Légende améliorée */}
      <CalendarLegend />

      {/* Conseils d'utilisation */}
      <CalendarTips />
    </div>
  );
};