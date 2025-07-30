import React from 'react';
import { MapPin } from 'lucide-react';

export const CalendarLegend: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-400';
      case 'published': return 'bg-yellow-400';
      case 'confirmed': return 'bg-green-400';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-400';
      default: return 'bg-blue-400';
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
  );
}; 