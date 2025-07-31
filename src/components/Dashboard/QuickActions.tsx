import React from 'react';
import {
  Calendar,
  Users,
  Star,
  Briefcase,
  Plus,
  Settings,
  BarChart3,
  FileText
} from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
  onCreateEvent: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate, onCreateEvent }) => {
  const actions = [
    {
      name: 'Créer un événement',
      description: 'Planifier un nouvel événement',
      icon: Plus,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      onClick: onCreateEvent,
    },
    {
      name: 'Gérer le personnel',
      description: 'Ajouter ou modifier des techniciens',
      icon: Users,
      color: 'bg-secondary-500',
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
      onClick: () => onNavigate('/admin/users'),
    },
    {
      name: 'Compétences',
      description: 'Gérer les compétences techniques',
      icon: Star,
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
      onClick: () => onNavigate('/admin/skills'),
    },
    {
      name: 'Affectations',
      description: 'Assigner des techniciens',
      icon: Briefcase,
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      onClick: () => onNavigate('/admin/assignments'),
    },
    {
      name: 'Rapports',
      description: 'Voir les statistiques détaillées',
      icon: BarChart3,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      onClick: () => onNavigate('/admin/reports'),
    },
    {
      name: 'Paramètres',
      description: 'Configurer l\'application',
      icon: Settings,
      color: 'bg-secondary-500',
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
      onClick: () => onNavigate('/admin/settings'),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-secondary-900">Actions rapides</h2>
        <p className="text-sm text-secondary-600">Accédez rapidement aux fonctionnalités principales</p>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                onClick={action.onClick}
                className="group relative p-4 rounded-xl border border-secondary-200 hover:border-secondary-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-secondary-50/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-5 w-5 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-secondary-900 group-hover:text-secondary-700 transition-colors duration-200">
                      {action.name}
                    </h3>
                    <p className="text-xs text-secondary-500 mt-1 group-hover:text-secondary-600 transition-colors duration-200">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Effet de survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 