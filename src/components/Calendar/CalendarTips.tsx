import React from 'react';
import { Users } from 'lucide-react';

export const CalendarTips: React.FC = () => {
  return (
    <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Users className="h-4 w-4 text-white" />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-blue-800 mb-1">Conseils d'utilisation</h5>
          <p className="text-xs text-blue-700">
            • Cliquez sur un événement pour voir les détails • Double-cliquez sur un créneau pour créer un nouvel événement • 
            Utilisez les boutons de navigation pour changer de vue • Les heures sont affichées dans chaque événement
          </p>
        </div>
      </div>
    </div>
  );
}; 