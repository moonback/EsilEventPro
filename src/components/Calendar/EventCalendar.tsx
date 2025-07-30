import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Event, CalendarEvent } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';

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
        borderRadius: '8px',
        opacity: 0.95,
        color: textColor,
        border: `2px solid ${borderColor}`,
        display: 'block',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '12px',
        fontWeight: '600',
        padding: '2px 4px',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        minHeight: '24px',
        lineHeight: '1.2',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'published': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 animate-fade-in">
      {/* Header du calendrier */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Calendrier des événements</h3>
              <p className="text-gray-600 text-sm">Gérez vos événements et affectations</p>
            </div>
          </div>
          
          {/* Statistiques rapides */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-xs text-gray-500">Événements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'confirmed').length}
              </div>
              <div className="text-xs text-gray-500">Confirmés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter(e => e.status === 'published').length}
              </div>
              <div className="text-xs text-gray-500">En attente</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div style={{ height }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            culture="fr"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable="ignoreEvents"
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
            popup
            step={60}
            timeslots={1}
          />
        </div>
      </div>
      
      {/* Légende améliorée */}
      <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
          Légende des statuts
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['draft', 'published', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <div key={status} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 transition-colors">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(status)} shadow-sm`}></div>
              <span className="text-sm font-medium text-gray-700">{getStatusText(status)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <h5 className="text-sm font-semibold text-blue-800 mb-1">Conseils d'utilisation</h5>
            <p className="text-xs text-blue-700">
              Cliquez sur un événement pour voir les détails • Double-cliquez sur un créneau pour créer un nouvel événement • 
              Utilisez les boutons de navigation pour changer de vue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};