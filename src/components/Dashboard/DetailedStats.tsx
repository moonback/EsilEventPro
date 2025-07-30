import React from 'react';
import { CheckCircle, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface DetailedStatsProps {
  stats: {
    confirmedEvents: number;
    draftEvents: number;
    pendingAssignments: number;
    acceptedAssignments: number;
    declinedAssignments: number;
  };
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Événements confirmés',
      value: stats.confirmedEvents,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Événements brouillon',
      value: stats.draftEvents,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Affectations en attente',
      value: stats.pendingAssignments,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Affectations acceptées',
      value: stats.acceptedAssignments,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Affectations refusées',
      value: stats.declinedAssignments,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Statistiques détaillées</h3>
            <p className="text-xs text-gray-600">Vue d'ensemble</p>
          </div>
        </div>
      </div>
      
      {/* Stats compactes */}
      <div className="p-4 space-y-3">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">{item.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 