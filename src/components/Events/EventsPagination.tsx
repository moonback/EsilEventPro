import React from 'react';

interface EventsPaginationProps {
  totalEvents: number;
  currentPage: number;
  eventsPerPage: number;
  onPageChange: (page: number) => void;
}

export const EventsPagination: React.FC<EventsPaginationProps> = ({
  totalEvents,
  currentPage,
  eventsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  const startItem = (currentPage - 1) * eventsPerPage + 1;
  const endItem = Math.min(currentPage * eventsPerPage, totalEvents);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Affichage de <span className="font-medium">{startItem}</span> à{' '}
        <span className="font-medium">{endItem}</span> sur{' '}
        <span className="font-medium">{totalEvents}</span> événements
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Précédent
        </button>
        <span className="px-3 py-1 text-sm text-gray-700">
          Page {currentPage} sur {totalPages}
        </span>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}; 