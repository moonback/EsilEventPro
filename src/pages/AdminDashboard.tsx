import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, AlertCircle, TrendingUp, UserPlus, Settings, Briefcase, Plus, BarChart3, MapPin, Trash2 } from 'lucide-react';
import { EventCalendar } from '../components/Calendar/EventCalendar';
import { EventForm } from '../components/Events/EventForm';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Event, EventFormData } from '../types';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import PersonnelManagement from './PersonnelManagement';
import SkillsManagement from './SkillsManagement';
import AssignmentsManagement from './AssignmentsManagement';

export const AdminDashboard: React.FC = () => {
  const { events, users, assignments, addEvent, updateEvent, deleteEvent, loadInitialData } = useAppStore();
  const { user } = useAuthStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'personnel' | 'skills' | 'assignments'>('dashboard');

  useEffect(() => {
    // Les données sont maintenant chargées automatiquement dans App.tsx
  }, []);

  // Statistiques
  const stats = {
    totalEvents: events.length,
    totalTechnicians: users.filter(u => u.role === 'technician').length,
    upcommingEvents: events.filter(e => new Date(e.startDate) > new Date()).length,
    pendingAssignments: assignments.filter(a => a.status === 'pending').length,
  };

  // Événements récents
  const upcomingEvents = events
    .filter(e => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const handleCreateEvent = (data: EventFormData) => {
    const eventType = useAppStore.getState().eventTypes.find(t => t.id === data.typeId);
    if (!eventType || !user) return;

    const newEvent = {
      ...data,
      type: eventType,
      assignments: [],
      status: 'draft' as const,
      createdBy: user.id,
    };

    addEvent(newEvent);
    setShowEventForm(false);
    toast.success('Événement créé avec succès !');
  };

  const handleUpdateEvent = (data: EventFormData) => {
    if (!selectedEvent) return;

    const eventType = useAppStore.getState().eventTypes.find(t => t.id === data.typeId);
    if (!eventType) return;

    updateEvent(selectedEvent.id, {
      ...data,
    });

    setSelectedEvent(null);
    setShowEventForm(false);
    toast.success('Événement mis à jour !');
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleCreateFromSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
      return;
    }

    try {
      await deleteEvent(event.id);
      toast.success('Événement supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
  };

  if (showEventForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h1>
              <p className="text-gray-600">Créez ou modifiez un événement</p>
            </div>
          </div>
        </div>

        <EventForm
          initialData={selectedEvent ? {
            title: selectedEvent.title,
            description: selectedEvent.description,
            startDate: new Date(selectedEvent.startDate),
            endDate: new Date(selectedEvent.endDate),
            location: selectedEvent.location,
            typeId: selectedEvent.type.id,
            requiredTechnicians: selectedEvent.requiredTechnicians,
          } : undefined}
          onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
        />
      </div>
    );
  }

  if (currentPage === 'personnel') {
    return <PersonnelManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === 'skills') {
    return <SkillsManagement onNavigate={handleNavigate} />;
  }

  if (currentPage === 'assignments') {
    return <AssignmentsManagement onNavigate={handleNavigate} />;
  }

  return (
    <div className="space-y-8">
      {/* Header avec navigation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-gray-600">Vue d'ensemble de votre gestion événementielle</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvel événement</span>
          </button>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalEvents}</div>
                <div className="text-sm text-gray-500">Événements</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalTechnicians}</div>
                <div className="text-sm text-gray-500">Techniciens</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.upcommingEvents}</div>
                <div className="text-sm text-gray-500">À venir</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleNavigate('personnel')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Personnel</div>
              <div className="text-sm text-gray-500">Gérer les équipes</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleNavigate('skills')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <Briefcase className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Compétences</div>
              <div className="text-sm text-gray-500">Catalogue des skills</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => handleNavigate('assignments')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Affectations</div>
              <div className="text-sm text-gray-500">Gérer les missions</div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => setShowEventForm(true)}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-300 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Nouvel événement</div>
              <div className="text-sm text-gray-500">Créer un événement</div>
            </div>
          </div>
        </button>
      </div>

      {/* Événements à venir */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Événements à venir</span>
            </h2>
            <span className="text-sm text-gray-500">{upcomingEvents.length} événement{upcomingEvents.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    event.status === 'published' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status === 'confirmed' ? 'Confirmé' :
                     event.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSelectEvent(event)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Modifier l'événement"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Supprimer l'événement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendrier */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Calendrier des événements</span>
          </h2>
        </div>
        
        <EventCalendar
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleCreateFromSlot}
          onDeleteEvent={handleDeleteEvent}
          height={600}
        />
      </div>
    </div>
  );
};