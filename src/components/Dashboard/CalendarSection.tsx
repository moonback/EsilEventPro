import React from 'react';
import { EventCalendar } from '../Calendar/EventCalendar';
import { Event } from '../../types';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header de la section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Calendrier des événements</h2>
              <p className="text-gray-600">Gérez et visualisez tous vos événements</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Cette semaine</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{weeklyEvents}</p>
              <p className="text-xs text-gray-500">événements</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Prochain</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">heures</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenu du calendrier */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
          <EventCalendar
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
            onDeleteEvent={onDeleteEvent}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}; 