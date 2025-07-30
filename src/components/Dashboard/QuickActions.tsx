import React from 'react';
import { Users, Star, CheckCircle, Plus, ChevronRight, Zap, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
  onCreateEvent: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate, onCreateEvent }) => {
  const actions = [
    {
      title: 'Gérer le personnel',
      description: 'Gérez votre équipe technique',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
      gradient: 'from-purple-500 to-purple-600',
      onClick: () => onNavigate('personnel'),
    },
    {
      title: 'Compétences',
      description: 'Gérez les compétences et spécialités',
      icon: Star,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-50',
      gradient: 'from-amber-500 to-amber-600',
      onClick: () => onNavigate('skills'),
    },
    {
      title: 'Affectations',
      description: 'Gérez les affectations d\'équipe',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-emerald-600',
      onClick: () => onNavigate('assignments'),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Actions rapides</h3>
            <p className="text-sm text-gray-600">Accès direct aux fonctionnalités principales</p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-6 space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${action.iconBgColor} rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}>
                <action.icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  {action.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </button>
        ))}

        {/* Bouton Nouvel événement avec design spécial */}
        <button
          onClick={onCreateEvent}
          className="group w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-white">
                Nouvel événement
              </h4>
              <p className="text-sm text-blue-100 group-hover:text-white transition-colors">
                Créer un nouvel événement
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
            <ChevronRight className="h-4 w-4 text-white/80 group-hover:text-white transition-colors" />
          </div>
        </button>
      </div>
    </div>
  );
}; 