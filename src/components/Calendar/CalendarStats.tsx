import React from 'react';
import { Event } from '../../types';

interface CalendarStatsProps {
  events: Event[];
}

export const CalendarStats: React.FC<CalendarStatsProps> = ({ events }) => {
  const stats = {
    total: events.length,
    confirmed: events.filter(e => e.status === 'confirmed').length,
    published: events.filter(e => e.status === 'published').length,
    draft: events.filter(e => e.status === 'draft').length,
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.total}
          </div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.confirmed}
          </div>
          <div className="text-xs text-gray-500">Confirmés</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.published}
          </div>
          <div className="text-xs text-gray-500">En attente</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {stats.draft}
          </div>
          <div className="text-xs text-gray-500">Brouillons</div>
        </div>
      </div>
    </div>
  );
}; 