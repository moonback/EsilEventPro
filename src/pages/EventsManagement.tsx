import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Event } from '../types';
import { isToday, isTomorrow, isPast } from 'date-fns';
import toast from 'react-hot-toast';

// Import des nouveaux composants
import { EventsHeader } from '../components/Events/EventsHeader';
import { EventsStats } from '../components/Events/EventsStats';
import { EventsFilters } from '../components/Events/EventsFilters';
import { EventsBulkActions } from '../components/Events/EventsBulkActions';
import { EventsTable } from '../components/Events/EventsTable';
import { EventsPagination } from '../components/Events/EventsPagination';

interface EventsManagementProps {
  onNavigate: (page: string) => void;
}

const EventsManagement: React.FC<EventsManagementProps> = ({ onNavigate }) => {
  const { events, eventTypes, users, deleteEvent, updateEventStatus } = useAppStore();
  
  // États locaux
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 20;

  // Fermer le menu de statut quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (statusMenuOpen && !target.closest('.status-dropdown')) {
        setStatusMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [statusMenuOpen]);

  // Filtrage et tri des événements
  const filteredAndSortedEvents = events
    .filter(event => {
      // Filtre par recherche
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par statut
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      // Filtre par type
      const eventType = eventTypes.find(t => t.id === event.type.id);
      const matchesType = typeFilter === 'all' || eventType?.id === typeFilter;
      
      // Filtre par date
      const eventDate = new Date(event.startDate);
      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = isToday(eventDate);
          break;
        case 'tomorrow':
          matchesDate = isTomorrow(eventDate);
          break;
        case 'past':
          matchesDate = isPast(eventDate);
          break;
        case 'upcoming':
          matchesDate = !isPast(eventDate);
          break;
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'type':
          const typeA = eventTypes.find(t => t.id === a.type.id)?.name || '';
          const typeB = eventTypes.find(t => t.id === b.type.id)?.name || '';
          comparison = typeA.localeCompare(typeB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = filteredAndSortedEvents.slice(startIndex, endIndex);

  // Statistiques
  const stats = {
    total: events.length,
    draft: events.filter(e => e.status === 'draft').length,
    published: events.filter(e => e.status === 'published').length,
    confirmed: events.filter(e => e.status === 'confirmed').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length,
  };

  // Handlers
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      toast.success('Événement supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const handleUpdateEventStatus = async (eventId: string, newStatus: string) => {
    console.log('Tentative de mise à jour du statut:', { eventId, newStatus });
    try {
      await updateEventStatus(eventId, newStatus as any);
      setStatusMenuOpen(null);
      toast.success(`Statut mis à jour vers ${getStatusText(newStatus)}`);
      console.log('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEvents.length} événement(s) ?`)) {
      return;
    }

    try {
      await Promise.all(selectedEvents.map(id => deleteEvent(id)));
      setSelectedEvents([]);
      toast.success(`${selectedEvents.length} événement(s) supprimé(s) avec succès`);
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error);
      toast.error('Erreur lors de la suppression en masse');
    }
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === paginatedEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(paginatedEvents.map(e => e.id));
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedEvents([]); // Réinitialiser la sélection lors du changement de page
  };

  // Utilitaires
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

  const getDateStatus = (date: Date) => {
    if (isPast(date)) return { text: 'Terminé', color: 'text-gray-500' };
    if (isToday(date)) return { text: "Aujourd'hui", color: 'text-blue-600 font-semibold' };
    if (isTomorrow(date)) return { text: 'Demain', color: 'text-yellow-600 font-semibold' };
    return { text: 'À venir', color: 'text-green-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <EventsHeader totalEvents={events.length} />

        {/* Statistiques */}
        <EventsStats stats={stats} />

        {/* Filtres */}
        <EventsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          eventTypes={eventTypes}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Actions en masse */}
        <EventsBulkActions
          selectedEvents={selectedEvents}
          totalEvents={paginatedEvents.length}
          onSelectAll={handleSelectAll}
          onBulkDelete={handleBulkDelete}
        />

        {/* Tableau des événements */}
        <EventsTable
          events={paginatedEvents}
          eventTypes={eventTypes}
          selectedEvents={selectedEvents}
          onSelectEvent={handleSelectEvent}
          onSelectAll={handleSelectAll}
          onDeleteEvent={handleDeleteEvent}
          onStatusChange={handleUpdateEventStatus}
          statusMenuOpen={statusMenuOpen}
          setStatusMenuOpen={setStatusMenuOpen}
          getDateStatus={getDateStatus}
        />

        {/* Pagination */}
        <EventsPagination
          totalEvents={filteredAndSortedEvents.length}
          currentPage={currentPage}
          eventsPerPage={eventsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EventsManagement; 