import React from 'react';
import { Users, Star, CheckCircle, Plus, ChevronRight } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
  onCreateEvent: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate, onCreateEvent }) => {
  const actions = [
    {
      title: 'Gérer le personnel',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      onClick: () => onNavigate('personnel'),
    },
    {
      title: 'Compétences',
      icon: Star,
      iconColor: 'text-amber-600',
      iconBgColor: 'bg-amber-100',
      onClick: () => onNavigate('skills'),
    },
    {
      title: 'Affectations',
      icon: CheckCircle,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-100',
      onClick: () => onNavigate('assignments'),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${action.iconBgColor} rounded-lg flex items-center justify-center`}>
                <action.icon className={`h-4 w-4 ${action.iconColor}`} />
              </div>
              <span className="font-medium text-gray-900">{action.title}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        ))}

        <button
          onClick={onCreateEvent}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">Nouvel événement</span>
          </div>
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}; 