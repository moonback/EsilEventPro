import React from 'react';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventsHeaderProps {
  totalEvents: number;
}

export const EventsHeader: React.FC<EventsHeaderProps> = ({ totalEvents }) => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    // Naviguer vers la page de création d'événements
    navigate('/admin/events/create');
  };

  const handleExport = () => {
    // TODO: Implémenter l'export des événements
    console.log('Export des événements');
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Événements</h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les événements de votre organisation ({totalEvents} événement{totalEvents > 1 ? 's' : ''})
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExport}
            className="btn-secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={handleCreateEvent}
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