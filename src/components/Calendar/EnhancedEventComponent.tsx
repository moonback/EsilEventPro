import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Clock, 
  MapPin, 
  Users, 
  Trash2, 
  Edit, 
  Eye,
  MoreHorizontal,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CalendarEvent } from '../../types';

interface EnhancedEventComponentProps {
  event: CalendarEvent;
  onDeleteEvent?: (event: CalendarEvent, e: React.MouseEvent) => void;
  showDetails?: boolean;
}

export const EnhancedEventComponent: React.FC<EnhancedEventComponentProps> = ({
  event,
  onDeleteEvent,
  showDetails = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { resource } = event;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'published': return 'bg-orange-500';
      case 'confirmed': return 'bg-green-500';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPriorityColor = () => {
    const startDate = new Date(event.start);
    const now = new Date();
    const diffHours = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 2) return 'text-red-500';
    if (diffHours < 24) return 'text-orange-500';
    if (diffHours < 72) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteEvent) {
      onDeleteEvent(event, e);
    }
    setShowMenu(false);
  };

  return (
    <div className="relative group">
      {/* Contenu principal de l'événement */}
      <div className="flex flex-col h-full">
        {/* En-tête avec titre et actions */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs leading-tight truncate">
              {event.title}
            </div>
          </div>
          
          {/* Menu d'actions */}
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
              title="Actions"
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-6 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action d'édition
                  }}
                  className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="h-3 w-3" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action de visualisation
                  }}
                  className="w-full px-3 py-1 text-left text-xs hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye className="h-3 w-3" />
                  <span>Voir détails</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-1 text-left text-xs hover:bg-red-50 text-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Supprimer</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Détails de l'événement */}
        {showDetails && (
          <div className="space-y-1 text-xs">
            {/* Heure */}
            <div className="flex items-center space-x-1 opacity-90">
              <Clock className="h-3 w-3" />
              <span>
                {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
              </span>
            </div>

            {/* Lieu */}
            {resource.location && (
              <div className="flex items-center space-x-1 opacity-90">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{resource.location}</span>
              </div>
            )}

            {/* Techniciens requis */}
            {resource.requiredTechnicians && resource.requiredTechnicians.length > 0 && (
              <div className="flex items-center space-x-1 opacity-90">
                <Users className="h-3 w-3" />
                <span>{resource.requiredTechnicians.length} technicien(s)</span>
              </div>
            )}

            {/* Statut avec indicateur de priorité */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)}`}></div>
                <span className="text-xs font-medium">
                  {getStatusText(resource.status)}
                </span>
              </div>
              
              {/* Indicateur de priorité */}
              <AlertCircle className={`h-3 w-3 ${getPriorityColor()}`} />
            </div>
          </div>
        )}

        {/* Indicateurs visuels */}
        <div className="absolute top-1 right-1 flex space-x-1">
          {/* Indicateur de type d'événement */}
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: resource.type.color }}
            title={resource.type.name}
          ></div>
          
          {/* Indicateur de conflit */}
          {resource.assignments && resource.assignments.length > 0 && (
            <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Affectations en cours"></div>
          )}
        </div>
      </div>

      {/* Overlay pour les interactions */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}; 