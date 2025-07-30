import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Clock, 
  Users, 
  Tag,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Download,
  Upload
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Event, EventType, User } from '../types';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface EventsManagementProps {
  onNavigate: (page: string) => void;
}

const EventsManagement: React.FC<EventsManagementProps> = ({ onNavigate }) => {
  const { events, eventTypes, users, deleteEvent, updateEventStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);

  // Fermer le menu de statut quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuOpen && !(event.target as Element).closest('.status-menu')) {
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

  // Statistiques
  const stats = {
    total: events.length,
    draft: events.filter(e => e.status === 'draft').length,
    published: events.filter(e => e.status === 'published').length,
    confirmed: events.filter(e => e.status === 'confirmed').length,
    completed: events.filter(e => e.status === 'completed').length,
    cancelled: events.filter(e => e.status === 'cancelled').length,
  };

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
    if (selectedEvents.length === filteredAndSortedEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredAndSortedEvents.map(e => e.id));
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

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

  const getDateStatus = (date: Date) => {
    if (isPast(date)) return { text: 'Terminé', color: 'text-gray-500' };
    if (isToday(date)) return { text: "Aujourd'hui", color: 'text-blue-600 font-semibold' };
    if (isTomorrow(date)) return { text: 'Demain', color: 'text-yellow-600 font-semibold' };
    return { text: 'À venir', color: 'text-green-600' };
  };

  const eventStatuses = [
    { value: 'draft', label: 'Brouillon', color: '#6B7280' },
    { value: 'published', label: 'Publié', color: '#3B82F6' },
    { value: 'confirmed', label: 'Confirmé', color: '#10B981' },
    { value: 'completed', label: 'Terminé', color: '#059669' },
    { value: 'cancelled', label: 'Annulé', color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Événements</h1>
              <p className="text-gray-600 mt-2">Gérez tous les événements de votre organisation</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
              <button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Événement
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-semibold">B</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                <p className="text-sm text-gray-600">Brouillons</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">P</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                <p className="text-sm text-gray-600">Publiés</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">C</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                <p className="text-sm text-gray-600">Confirmés</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">T</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Terminés</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">A</span>
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                <p className="text-sm text-gray-600">Annulés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Filtres avancés */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Filtre par statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>

                  {/* Filtre par type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type d'événement</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tous les types</option>
                      {eventTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filtre par date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Toutes les dates</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="tomorrow">Demain</option>
                      <option value="upcoming">À venir</option>
                      <option value="past">Passés</option>
                    </select>
                  </div>

                  {/* Tri */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field as any);
                        setSortOrder(order as any);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="date-desc">Date (récent)</option>
                      <option value="date-asc">Date (ancien)</option>
                      <option value="title-asc">Titre (A-Z)</option>
                      <option value="title-desc">Titre (Z-A)</option>
                      <option value="status-asc">Statut (A-Z)</option>
                      <option value="type-asc">Type (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions en masse */}
        {selectedEvents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedEvents.length} événement(s) sélectionné(s)
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedEvents.length === filteredAndSortedEvents.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des événements */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedEvents.length === filteredAndSortedEvents.length && filteredAndSortedEvents.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affectations
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedEvents.map((event) => {
                  const eventType = eventTypes.find(t => t.id === event.type.id);
                  const eventAssignments = event.assignments || [];
                  const dateStatus = getDateStatus(new Date(event.startDate));
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleSelectEvent(event.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div 
                              className="h-10 w-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: eventType?.color + '20', color: eventType?.color }}
                            >
                              <Calendar className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div 
                            className="h-2 w-2 rounded-full mr-2"
                            style={{ backgroundColor: eventType?.color }}
                          />
                          <span className="text-sm text-gray-900">{eventType?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(event.startDate), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                        <div className={`text-xs ${dateStatus.color}`}>
                          {dateStatus.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => setStatusMenuOpen(statusMenuOpen === event.id ? null : event.id)}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)} hover:opacity-80 transition-opacity status-menu`}
                          >
                            {getStatusText(event.status)}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </button>
                          
                          {statusMenuOpen === event.id && (
                            <div className="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                              {eventStatuses.map((status) => (
                                <button
                                  key={status.value}
                                  onClick={() => handleUpdateEventStatus(event.id, status.value)}
                                  className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 ${
                                    event.status === status.value ? 'bg-gray-100 font-medium' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <div 
                                      className="h-2 w-2 rounded-full mr-2"
                                      style={{ backgroundColor: status.color }}
                                    />
                                    {status.label}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          {eventAssignments.length} technicien(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination ou message si aucun événement */}
          {filteredAndSortedEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun événement trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche.'
                  : 'Commencez par créer votre premier événement.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAndSortedEvents.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à{' '}
              <span className="font-medium">{filteredAndSortedEvents.length}</span> sur{' '}
              <span className="font-medium">{filteredAndSortedEvents.length}</span> événements
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Précédent
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagement; 