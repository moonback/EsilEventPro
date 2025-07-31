import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent } from '../../types';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface CalendarMiniMapProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  expanded: boolean;
}

export const CalendarMiniMap: React.FC<CalendarMiniMapProps> = ({
  events,
  currentDate,
  onDateSelect,
  expanded,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Grouper les événements par jour
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    events.forEach(event => {
      const dayKey = format(event.start, 'yyyy-MM-dd');
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(event);
    });
    return grouped;
  }, [events]);

  const getEventCountColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-blue-200';
    if (count <= 5) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getEventCountTextColor = (count: number) => {
    if (count === 0) return 'text-gray-400';
    if (count <= 2) return 'text-blue-700';
    if (count <= 5) return 'text-orange-700';
    return 'text-red-700';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateSelect(newDate);
  };

  const goToToday = () => {
    onDateSelect(new Date());
  };

  if (!expanded) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Mini-carte</h3>
          <button
            onClick={() => {/* Toggle expanded */}}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Développer"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        
        {/* Mini-calendrier compact */}
        <div className="grid grid-cols-7 gap-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="text-xs text-gray-500 text-center py-1">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay[dayKey] || [];
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);
            
            return (
              <button
                key={index}
                onClick={() => onDateSelect(day)}
                className={`
                  relative p-1 text-xs rounded transition-all duration-200
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isCurrentDay ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}
                  ${dayEvents.length > 0 ? 'font-medium' : ''}
                `}
                title={`${format(day, 'EEEE dd MMMM yyyy', { locale: fr })} - ${dayEvents.length} événement(s)`}
              >
                <span>{format(day, 'd')}</span>
                
                {/* Indicateur d'événements */}
                {dayEvents.length > 0 && (
                  <div className={`
                    absolute -top-1 -right-1 w-2 h-2 rounded-full text-xs
                    ${getEventCountColor(dayEvents.length)}
                    ${getEventCountTextColor(dayEvents.length)}
                    flex items-center justify-center
                  `}>
                    {dayEvents.length > 3 ? '3+' : dayEvents.length}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mini-carte du calendrier</h3>
        <button
          onClick={() => {/* Toggle expanded */}}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Réduire"
        >
          <Minimize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mois précédent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="flex items-center space-x-4">
          <h4 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h4>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Aujourd'hui
          </button>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Mois suivant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendrier étendu */}
      <div className="grid grid-cols-7 gap-1">
        {/* En-têtes des jours */}
        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-600 text-center py-2">
            {day.slice(0, 3)}
          </div>
        ))}
        
        {/* Jours du mois */}
        {days.map((day, index) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDay[dayKey] || [];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const isSelected = isSameDay(day, currentDate);
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
                relative p-2 text-sm rounded-lg transition-all duration-200 min-h-[60px]
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isCurrentDay ? 'bg-blue-500 text-white font-bold' : ''}
                ${isSelected ? 'ring-2 ring-blue-300' : ''}
                ${!isCurrentDay && !isSelected ? 'hover:bg-gray-50' : ''}
                ${dayEvents.length > 0 ? 'font-medium' : ''}
              `}
              title={`${format(day, 'EEEE dd MMMM yyyy', { locale: fr })} - ${dayEvents.length} événement(s)`}
            >
              <div className="text-center mb-1">
                <span>{format(day, 'd')}</span>
              </div>
              
              {/* Événements du jour */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`
                      w-full h-1 rounded-full
                      ${event.resource.status === 'confirmed' ? 'bg-green-400' : ''}
                      ${event.resource.status === 'published' ? 'bg-orange-400' : ''}
                      ${event.resource.status === 'draft' ? 'bg-gray-400' : ''}
                      ${event.resource.status === 'completed' ? 'bg-gray-600' : ''}
                      ${event.resource.status === 'cancelled' ? 'bg-red-400' : ''}
                    `}
                    title={`${event.title} - ${event.resource.status}`}
                  />
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-center opacity-75">
                    +{dayEvents.length - 3}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Légende</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Confirmé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>Publié</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>Brouillon</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>Annulé</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 