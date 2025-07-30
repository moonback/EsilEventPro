import React from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from '../../types';
import { EventComponent } from './EventComponent';

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

interface CalendarContainerProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onDeleteEvent?: (event: CalendarEvent, e: React.MouseEvent) => void;
  height?: number;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  events,
  onSelectEvent,
  onSelectSlot,
  onDeleteEvent,
  height = 700,
}) => {
  const eventStyleGetter = (event: CalendarEvent) => {
    const { resource } = event;
    let backgroundColor = '#3B82F6'; // Bleu par défaut
    let borderColor = '#2563EB';
    let textColor = '#FFFFFF';
    
    // Couleurs selon le statut avec dégradés
    switch (resource.status) {
      case 'draft':
        backgroundColor = 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)';
        borderColor = '#6B7280';
        break;
      case 'published':
        backgroundColor = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
        borderColor = '#D97706';
        break;
      case 'confirmed':
        backgroundColor = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
        borderColor = '#059669';
        break;
      case 'completed':
        backgroundColor = 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';
        borderColor = '#4B5563';
        break;
      case 'cancelled':
        backgroundColor = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
        borderColor = '#DC2626';
        break;
      default:
        backgroundColor = `linear-gradient(135deg, ${resource.type.color} 0%, ${resource.type.color}dd 100%)`;
        borderColor = resource.type.color;
    }

    return {
      style: {
        background: backgroundColor,
        borderRadius: '6px',
        opacity: 0.95,
        color: textColor,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        fontSize: '11px',
        fontWeight: '500',
        padding: '4px 6px',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        minHeight: '32px',
        lineHeight: '1.3',
        overflow: 'hidden',
      },
      className: 'group hover:opacity-100 event-item',
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div style={{ height }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="fr"
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          selectable="ignoreEvents"
          eventPropGetter={eventStyleGetter}
          components={{
            event: (props) => <EventComponent {...props} onDeleteEvent={onDeleteEvent} />,
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
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
              `${format(start, 'dd MMM', { locale: fr })} - ${format(end, 'dd MMM yyyy', { locale: fr })}`,
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
            dayFormat: 'dd MMM',
            selectRangeFormat: ({ start, end }) =>
              `${format(start, 'dd/MM/yyyy HH:mm')} - ${format(end, 'dd/MM/yyyy HH:mm')}`,
          }}
          className="event-calendar"
          popup
          step={15}
          timeslots={4}
          min={new Date(0, 0, 0, 6, 0, 0)} // Commence à 6h
          max={new Date(0, 0, 0, 22, 0, 0)} // Termine à 22h
          dayLayoutAlgorithm="no-overlap"
          scrollToTime={new Date(0, 0, 0, 8, 0, 0)} // Scroll vers 8h par défaut
          length={30} // Durée par défaut des créneaux (30 minutes)
          rtl={false}
          showMultiDayTimes={true}
        />
      </div>
    </div>
  );
}; 