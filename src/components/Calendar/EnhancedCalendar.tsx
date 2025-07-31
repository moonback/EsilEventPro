import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View, Views, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isToday, isSameDay, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Filter,
  Search,
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent, Event } from '../../types';
import { EnhancedEventComponent } from './EnhancedEventComponent';
import { CalendarFilters } from './CalendarFilters';
import { CalendarQuickActions } from './CalendarQuickActions';
import { CalendarMiniMap } from './CalendarMiniMap';

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

interface EnhancedCalendarProps {
  events: Event[];
  onSelectEvent?: (event: Event) => void;
  onSelectSlot?: (slotInfo: SlotInfo) => void;
  onDeleteEvent?: (event: Event) => void;
  onExportCalendar?: () => void;
  height?: number;
  showFilters?: boolean;
  showMiniMap?: boolean;
  showQuickActions?: boolean;
}

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  events,
  onSelectEvent,
  onSelectSlot,
  onDeleteEvent,
  onExportCalendar,
  height = 700,
  showFilters = true,
  showMiniMap = true,
  showQuickActions = true,
}) => {
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    dateRange: 'all',
  });
  const [showEventDetails, setShowEventDetails] = useState(true);
  const [showMiniMapExpanded, setShowMiniMapExpanded] = useState(false);

  // Conversion des événements avec optimisation
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events
      .filter(event => {
        if (filters.status !== 'all' && event.status !== filters.status) return false;
        if (filters.type !== 'all' && event.type.id !== filters.type) return false;
        if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      })
      .map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        resource: event,
      }));
  }, [events, filters]);

  // Statistiques en temps réel
  const stats = useMemo(() => {
    const today = new Date();
    const thisWeek = {
      start: subDays(today, today.getDay()),
      end: addDays(today, 6 - today.getDay()),
    };

    return {
      total: events.length,
      today: events.filter(e => isToday(new Date(e.startDate))).length,
      thisWeek: events.filter(e => {
        const eventDate = new Date(e.startDate);
        return eventDate >= thisWeek.start && eventDate <= thisWeek.end;
      }).length,
      byStatus: events.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [events]);

  // Styles d'événements améliorés avec animations
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const { resource } = event;
    const isTodayEvent = isToday(new Date(event.start));
    const isSelected = false; // À connecter avec la sélection

    let backgroundColor = '#3B82F6';
    let borderColor = '#2563EB';
    let textColor = '#FFFFFF';
    let shadow = '0 1px 3px rgba(0,0,0,0.1)';

    // Couleurs selon le statut avec dégradés professionnels
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

    // Effets spéciaux pour aujourd'hui
    if (isTodayEvent) {
      shadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
      borderColor = '#3B82F6';
    }

    // Effets pour la sélection
    if (isSelected) {
      shadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
    }

    return {
      style: {
        background: backgroundColor,
        borderRadius: '8px',
        opacity: 0.95,
        color: textColor,
        border: `2px solid ${borderColor}`,
        boxShadow: shadow,
        fontSize: '11px',
        fontWeight: '600',
        padding: '6px 8px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        minHeight: '36px',
        lineHeight: '1.4',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(4px)',
      },
      className: `group hover:opacity-100 event-item ${isTodayEvent ? 'today-event' : ''} ${isSelected ? 'selected-event' : ''}`,
    };
  }, []);

  // Navigation rapide
  const handleNavigate = useCallback((action: 'PREV' | 'NEXT' | 'TODAY') => {
    switch (action) {
      case 'PREV':
        setCurrentDate(prev => subDays(prev, currentView === Views.MONTH ? 30 : 7));
        break;
      case 'NEXT':
        setCurrentDate(prev => addDays(prev, currentView === Views.MONTH ? 30 : 7));
        break;
      case 'TODAY':
        setCurrentDate(new Date());
        break;
    }
  }, [currentView]);

  // Gestion des vues
  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  // Gestion des événements
  const handleSelectEvent = useCallback((calendarEvent: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(calendarEvent.resource);
    }
  }, [onSelectEvent]);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }
  }, [onSelectSlot]);

  const handleDeleteEvent = useCallback((calendarEvent: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(calendarEvent.resource);
    }
  }, [onDeleteEvent]);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques et actions rapides */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Titre et navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Calendrier des Événements</h2>
            </div>
            
            {/* Navigation rapide */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNavigate('PREV')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Précédent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleNavigate('TODAY')}
                className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => handleNavigate('NEXT')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Suivant"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Total: {stats.total}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Aujourd'hui: {stats.today}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Cette semaine: {stats.thisWeek}</span>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        {showQuickActions && (
          <CalendarQuickActions
            onExport={onExportCalendar}
            onToggleDetails={() => setShowEventDetails(!showEventDetails)}
            onToggleMiniMap={() => setShowMiniMapExpanded(!showMiniMapExpanded)}
            showDetails={showEventDetails}
            showMiniMap={showMiniMapExpanded}
          />
        )}
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <CalendarFilters
          filters={filters}
          onFiltersChange={setFilters}
          stats={stats}
        />
      )}

      {/* Conteneur principal du calendrier */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div style={{ height }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            culture="fr"
            view={currentView}
            onView={handleViewChange}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable="ignoreEvents"
            eventPropGetter={eventStyleGetter}
            components={{
              event: (props) => (
                <EnhancedEventComponent
                  {...props}
                  onDeleteEvent={handleDeleteEvent}
                  showDetails={showEventDetails}
                />
              ),
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
            className="enhanced-calendar"
            popup
            step={15}
            timeslots={4}
            min={new Date(0, 0, 0, 6, 0, 0)}
            max={new Date(0, 0, 0, 22, 0, 0)}
            dayLayoutAlgorithm="no-overlap"
            scrollToTime={new Date(0, 0, 0, 8, 0, 0)}
            length={30}
            rtl={false}
            showMultiDayTimes={true}
            tooltipAccessor={(event) => `${event.title} - ${format(event.start, 'HH:mm')} - ${format(event.end, 'HH:mm')}`}
          />
        </div>
      </div>

      {/* Mini-carte pour navigation rapide */}
      {showMiniMap && (
        <CalendarMiniMap
          events={calendarEvents}
          currentDate={currentDate}
          onDateSelect={setCurrentDate}
          expanded={showMiniMapExpanded}
        />
      )}
    </div>
  );
}; 