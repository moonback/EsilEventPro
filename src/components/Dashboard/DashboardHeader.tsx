import React from 'react';
import { Filter, Plus, Bell, Search, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  onCreateEvent: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateEvent }) => {
  return (
    <div className="mb-8">
      {/* Header principal avec gradient et design moderne */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Tableau de Bord</h1>
              <p className="text-blue-100 text-lg">Vue d'ensemble de votre gestion événementielle</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></span>
            </button>
            
            {/* Paramètres */}
            <button className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200">
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions rapides sous le header */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Filtres</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Vue:</span>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Mensuelle</option>
              <option>Hebdomadaire</option>
              <option>Quotidienne</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={onCreateEvent}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Nouvel Événement</span>
        </button>
      </div>
    </div>
  );
}; 