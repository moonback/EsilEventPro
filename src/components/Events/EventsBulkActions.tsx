import React from 'react';
import { Trash2 } from 'lucide-react';

interface EventsBulkActionsProps {
  selectedEvents: string[];
  totalEvents: number;
  onSelectAll: () => void;
  onBulkDelete: () => void;
}

export const EventsBulkActions: React.FC<EventsBulkActionsProps> = ({
  selectedEvents,
  totalEvents,
  onSelectAll,
  onBulkDelete,
}) => {
  if (selectedEvents.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedEvents.length} événement(s) sélectionné(s)
          </span>
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {selectedEvents.length === totalEvents ? 'Désélectionner tout' : 'Sélectionner tout'}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBulkDelete}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 