import React from 'react';
import { ChevronDown } from 'lucide-react';

interface EventStatusDropdownProps {
  eventId: string;
  currentStatus: string;
  isOpen: boolean;
  onToggle: () => void;
  onStatusChange: (eventId: string, newStatus: string) => void;
}

export const EventStatusDropdown: React.FC<EventStatusDropdownProps> = ({
  eventId,
  currentStatus,
  isOpen,
  onToggle,
  onStatusChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const eventStatuses = [
    { value: 'draft', label: 'Brouillon', color: '#6B7280' },
    { value: 'published', label: 'Publié', color: '#3B82F6' },
    { value: 'confirmed', label: 'Confirmé', color: '#10B981' },
    { value: 'completed', label: 'Terminé', color: '#059669' },
    { value: 'cancelled', label: 'Annulé', color: '#EF4444' },
  ];

  return (
    <div className="relative inline-block text-left status-dropdown" style={{ zIndex: 1000 }}>
      <button
        onClick={onToggle}
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentStatus)} hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:shadow-md`}
      >
        {getStatusText(currentStatus)}
        <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-[9999] mt-2 w-40 bg-white rounded-md shadow-xl border border-gray-200 py-1 ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200 ease-out">
          {eventStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusChange(eventId, status.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150 ${
                currentStatus === status.value ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              <div className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full mr-3"
                  style={{ backgroundColor: status.color }}
                />
                {status.label}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 