import React from 'react';
import { Filter, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateEvent: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateEvent }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre gestion événementielle</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
          <button
            onClick={onCreateEvent}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Événement
          </button>
        </div>
      </div>
    </div>
  );
}; 