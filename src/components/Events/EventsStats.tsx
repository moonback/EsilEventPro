import React from 'react';
import { Calendar } from 'lucide-react';

interface EventsStatsProps {
  stats: {
    total: number;
    draft: number;
    published: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

export const EventsStats: React.FC<EventsStatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Total', value: stats.total, icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-600' },
    { label: 'Brouillons', value: stats.draft, color: 'text-gray-600', bgColor: 'bg-gray-100', letter: 'B' },
    { label: 'Publiés', value: stats.published, color: 'text-blue-600', bgColor: 'bg-blue-100', letter: 'P' },
    { label: 'Confirmés', value: stats.confirmed, color: 'text-green-600', bgColor: 'bg-green-100', letter: 'C' },
    { label: 'Terminés', value: stats.completed, color: 'text-purple-600', bgColor: 'bg-purple-100', letter: 'T' },
    { label: 'Annulés', value: stats.cancelled, color: 'text-red-600', bgColor: 'bg-red-100', letter: 'A' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            {item.icon ? (
              <item.icon className={`h-8 w-8 ${item.color}`} />
            ) : (
              <div className={`h-8 w-8 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <span className={`${item.color} font-semibold`}>{item.letter}</span>
              </div>
            )}
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 