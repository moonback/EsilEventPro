import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event, CalendarEvent } from '../../types';
import { useAppStore } from '../../store/useAppStore';

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface EventCalendarProps {
  onSelectEvent?: (event: Event) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  height?: number;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  onSelectEvent,
  onSelectSlot,
  height = 600,
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

  const eventStyleGetter = (event: CalendarEvent) => {
    const { resource } = event;
    let backgroundColor = '#3B82F6'; // Bleu par défaut
    
    // Couleurs selon le statut
    switch (resource.status) {
      case 'draft':
        backgroundColor = '#9CA3AF'; // Gris
        break;
      case 'published':
        backgroundColor = '#F59E0B'; // Orange
        break;
      case 'confirmed':
        backgroundColor = '#10B981'; // Vert
        break;
      case 'completed':
        backgroundColor = '#6B7280'; // Gris foncé
        break;
      case 'cancelled':
        backgroundColor = '#EF4444'; // Rouge
        break;
      default:
        backgroundColor = resource.type.color;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleSelectEvent = (calendarEvent: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(calendarEvent.resource);
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div style={{ height }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          culture="fr"
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          messages={{
            next: 'Suivant',
            previous: 'Précédent',
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour',
            agenda: 'Agenda',
            date: 'Date',
            time: 'Heure',
            event: 'Événement',
            noEventsInRange: 'Aucun événement dans cette période',
            showMore: (total) => `+ ${total} de plus`,
          }}
          formats={{
            monthHeaderFormat: 'MMMM yyyy',
            dayHeaderFormat: 'EEEE dd MMMM',
            dayRangeHeaderFormat: ({ start, end }) =>
              `${format(start, 'dd MMMM', { locale: fr })} - ${format(end, 'dd MMMM yyyy', { locale: fr })}`,
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
          }}
          className="event-calendar"
        />
      </div>
      
      {/* Légende */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span>Brouillon</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>Publié</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Confirmé</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <span>Terminé</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Annulé</span>
        </div>
      </div>
    </div>
  );
};