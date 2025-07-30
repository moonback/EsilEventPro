import React from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Event } from '../../types';

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const upcomingEvents = events
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-gray-50 to-emerald-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-3 w-3 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Événements à venir</h3>
              <p className="text-xs text-gray-600">Prochains événements</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Liste compacte */}
      <div className="p-4 space-y-3">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucun événement à venir</p>
          </div>
        ) : (
          upcomingEvents.map((event, index) => (
            <div key={event.id} className="group p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-gray-50/30 hover:bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {event.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Users className="h-3 w-3" />
                      <span>{event.requiredTechnicians.length} technicien(s) requis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 