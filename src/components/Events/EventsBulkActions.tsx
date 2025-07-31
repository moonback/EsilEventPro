import React from 'react';
import { Trash2, Upload } from 'lucide-react';

interface EventsBulkActionsProps {
  selectedEvents: string[];
  totalEvents: number;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  onImportICal?: () => void;
}

export const EventsBulkActions: React.FC<EventsBulkActionsProps> = ({
  selectedEvents,
  totalEvents,
  onSelectAll,
  onBulkDelete,
  onImportICal,
}) => {
  // Si aucun événement n'est sélectionné, afficher seulement le bouton d'import
  if (selectedEvents.length === 0) {
    return onImportICal ? (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-end">
          <button
            onClick={onImportICal}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Importer iCal</span>
          </button>
        </div>
      </div>
    ) : null;
  }

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
          {onImportICal && (
            <button
              onClick={onImportICal}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Importer iCal</span>
            </button>
          )}
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