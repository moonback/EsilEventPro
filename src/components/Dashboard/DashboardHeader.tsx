import React from 'react';
import { Plus, Bell, Search, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateEvent: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateEvent }) => {
  return (
    <div className="mb-6">
      {/* Header principal compact */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Titre et description */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
          <p className="text-sm text-gray-600">Gérez vos événements et votre équipe technique</p>
        </div>
        
        {/* Actions rapides */}
        <div className="flex items-center space-x-3">
          {/* Barre de recherche compacte */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          {/* Bouton notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Bouton menu mobile */}
          <button className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Bouton créer événement */}
          <button
            onClick={onCreateEvent}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Nouvel événement</span>
          </button>
        </div>
      </div>
      
      {/* Indicateurs de statut rapides */}
      <div className="mt-4 flex flex-wrap items-center space-x-6 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Système opérationnel</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>5 événements en cours</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span>3 affectations en attente</span>
        </div>
      </div>
    </div>
  );
}; 