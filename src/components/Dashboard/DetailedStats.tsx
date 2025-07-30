import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
      trend: 'up' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: TrendingUp
    },
    { 
      label: 'Événements en brouillon', 
      value: stats.draftEvents,
      trend: 'down' as const,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: Activity
    },
    { 
      label: 'Affectations en attente', 
      value: stats.pendingAssignments,
      trend: 'up' as const,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: Activity
    },
    { 
      label: 'Affectations acceptées', 
      value: stats.acceptedAssignments,
      trend: 'up' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: TrendingUp
    },
    { 
      label: 'Affectations refusées', 
      value: stats.declinedAssignments,
      trend: 'down' as const,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: TrendingDown
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Statistiques détaillées</h3>
            <p className="text-sm text-gray-600">Vue d'ensemble des performances</p>
          </div>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="p-6 space-y-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:shadow-md transition-all duration-300`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors">
                    {item.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                  {item.value}
                </span>
                <div className={`w-2 h-2 rounded-full ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 