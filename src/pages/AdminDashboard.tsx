import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, AlertCircle, TrendingUp, UserPlus, Settings, Briefcase, Plus, BarChart3, MapPin, Trash2, Activity, Star, ChevronRight } from 'lucide-react';
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
      <div className="space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h1>
                <p className="text-blue-100 text-lg">Créez ou modifiez un événement</p>
              </div>
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
      {/* Header héroïque */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -mr-48 -mt-48"></div>
        
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Tableau de Bord</h1>
              <p className="text-blue-100 text-lg">Vue d'ensemble de votre gestion événementielle</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowEventForm(true)}
            className="group relative overflow-hidden flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm text-white rounded-2xl font-semibold border border-white/20 hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-indigo-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="h-6 w-6 relative z-10" />
            <span className="relative z-10">Nouvel événement</span>
          </button>
        </div>

        {/* Statistiques principales avec glassmorphism */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.totalEvents}</div>
                <div className="text-blue-100">Événements</div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.totalTechnicians}</div>
                <div className="text-blue-100">Techniciens</div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400/30 to-amber-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.upcommingEvents}</div>
                <div className="text-blue-100">À venir</div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stats.pendingAssignments}</div>
                <div className="text-blue-100">En attente</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation rapide avec animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button
          onClick={() => handleNavigate('personnel')}
          className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-gray-900 mb-1">Personnel</div>
              <div className="text-sm text-gray-500">Gérer les équipes</div>
            </div>
            <ChevronRight className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
        
        <button
          onClick={() => handleNavigate('skills')}
          className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-600/0 group-hover:from-amber-500/5 group-hover:to-amber-600/10 transition-all duration-300"></div>
          <div className="relative flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Star className="h-8 w-8 text-amber-600" />
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-gray-900 mb-1">Compétences</div>
              <div className="text-sm text-gray-500">Catalogue des skills</div>
            </div>
            <ChevronRight className="h-5 w-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
        
        <button
          onClick={() => handleNavigate('assignments')}
          className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-600/0 group-hover:from-emerald-500/5 group-hover:to-emerald-600/10 transition-all duration-300"></div>
          <div className="relative flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-gray-900 mb-1">Affectations</div>
              <div className="text-sm text-gray-500">Gérer les missions</div>
            </div>
            <ChevronRight className="h-5 w-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
        
        <button
          onClick={() => setShowEventForm(true)}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/10 group-hover:to-white/5 transition-all duration-300"></div>
          <div className="relative flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg border border-white/30">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-white mb-1">Événement</div>
              <div className="text-sm text-blue-100">Créer un nouveau</div>
            </div>
            <Activity className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
      </div>

      {/* Événements à venir avec design moderne */}
      {upcomingEvents.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span>Événements à venir</span>
            </h2>
            <div className="flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">{upcomingEvents.length} événement{upcomingEvents.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className="group relative overflow-hidden bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{event.title}</h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{format(new Date(event.startDate), 'dd MMM yyyy', { locale: fr })}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                      event.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      event.status === 'published' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {event.status === 'confirmed' ? 'Confirmé' :
                       event.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleSelectEvent(event)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Modifier l'événement"
                      >
                        <Settings className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Supprimer l'événement"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendrier avec design premium */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span>Calendrier des événements</span>
          </h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <EventCalendar
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleCreateFromSlot}
            onDeleteEvent={handleDeleteEvent}
            height={600}
          />
        </div>
      </div>
    </div>
  );
};