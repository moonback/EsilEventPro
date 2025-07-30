import React from 'react';

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
    { label: 'Événements confirmés', value: stats.confirmedEvents },
    { label: 'Événements en brouillon', value: stats.draftEvents },
    { label: 'Affectations en attente', value: stats.pendingAssignments },
    { label: 'Affectations acceptées', value: stats.acceptedAssignments },
    { label: 'Affectations refusées', value: stats.declinedAssignments },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques détaillées</h3>
      <div className="space-y-4">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 