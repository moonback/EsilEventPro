import React from 'react';
import { Users, Star, CheckCircle, Plus, ChevronRight, Zap, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
  onCreateEvent: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate, onCreateEvent }) => {
  const actions = [
    {
      title: 'Personnel',
      description: 'Gérer l\'équipe',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => onNavigate('personnel'),
    },
    {
      title: 'Compétences',
      description: 'Gérer les spécialités',
      icon: Star,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-50',
      gradient: 'from-amber-500 to-amber-600',
      onClick: () => onNavigate('skills'),
    },
    {
      title: 'Affectations',
      description: 'Gérer l\'équipe',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-emerald-600',
      onClick: () => onNavigate('assignments'),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Zap className="h-3 w-3 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Actions rapides</h3>
            <p className="text-xs text-gray-600">Accès direct</p>
          </div>
        </div>
      </div>
      
      {/* Actions compactes */}
      <div className="p-4 space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${action.iconBgColor} rounded-lg flex items-center justify-center group-hover:shadow-md transition-all duration-200`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  {action.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        ))}

        {/* Bouton Nouvel événement compact */}
        <button
          onClick={onCreateEvent}
          className="group w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white">
                Nouvel événement
              </h4>
              <p className="text-xs text-blue-100 group-hover:text-white transition-colors">
                Créer un événement
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Sparkles className="h-3 w-3 text-white/80 group-hover:text-white transition-colors" />
            <ChevronRight className="h-3 w-3 text-white/80 group-hover:text-white transition-colors" />
          </div>
        </button>
      </div>
    </div>
  );
}; 