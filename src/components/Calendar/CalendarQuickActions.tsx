import React from 'react';
import { 
  Download, 
  Eye, 
  EyeOff, 
  Map, 
  Settings,
  Share2,
  Printer,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

interface CalendarQuickActionsProps {
  onExport?: () => void;
  onToggleDetails: () => void;
  onToggleMiniMap: () => void;
  showDetails: boolean;
  showMiniMap: boolean;
}

export const CalendarQuickActions: React.FC<CalendarQuickActionsProps> = ({
  onExport,
  onToggleDetails,
  onToggleMiniMap,
  showDetails,
  showMiniMap,
}) => {
  const actions = [
    {
      icon: showDetails ? Eye : EyeOff,
      label: showDetails ? 'Masquer détails' : 'Afficher détails',
      onClick: onToggleDetails,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      icon: Map,
      label: showMiniMap ? 'Masquer mini-carte' : 'Afficher mini-carte',
      onClick: onToggleMiniMap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      icon: Download,
      label: 'Exporter',
      onClick: onExport,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
    {
      icon: Share2,
      label: 'Partager',
      onClick: () => {
        // Action de partage
        if (navigator.share) {
          navigator.share({
            title: 'Calendrier des événements',
            text: 'Consultez notre calendrier d\'événements',
            url: window.location.href,
          });
        } else {
          // Fallback pour copier le lien
          navigator.clipboard.writeText(window.location.href);
        }
      },
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100',
    },
    {
      icon: Printer,
      label: 'Imprimer',
      onClick: () => window.print(),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
    },
    {
      icon: Settings,
      label: 'Paramètres',
      onClick: () => {
        // Action des paramètres
      },
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      hoverColor: 'hover:bg-gray-100',
    },
  ];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 ease-in-out
              ${action.bgColor} ${action.color} ${action.hoverColor}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transform hover:scale-105 active:scale-95
            `}
            title={action.label}
          >
            <action.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Indicateurs d'état */}
      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3" />
          <span>Vue calendrier</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Temps réel</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="h-3 w-3" />
          <span>Collaboratif</span>
        </div>
      </div>
    </div>
  );
}; 