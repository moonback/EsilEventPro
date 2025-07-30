import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Clock, CheckCircle, AlertCircle, TrendingUp, UserPlus, Settings, Briefcase, Plus,
  BarChart3, MapPin, Trash2, Activity, Star, ChevronRight, Eye, Edit, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Target, Zap, Award, DollarSign, CalendarDays, Filter
} from 'lucide-react';
import { EventCalendar } from '../components/Calendar/EventCalendar';
import { EventForm } from '../components/Events/EventForm';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Event, EventFormData } from '../types';
import { format, isToday, isTomorrow, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
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

  // Statistiques avancées
  const stats = {
    totalEvents: events.length,
    totalTechnicians: users.filter(u => u.role === 'technician').length,
    upcomingEvents: events.filter(e => new Date(e.startDate) > new Date()).length,
    pendingAssignments: assignments.filter(a => a.status === 'pending').length,
    completedEvents: events.filter(e => e.status === 'completed').length,
    confirmedEvents: events.filter(e => e.status === 'confirmed').length,
    draftEvents: events.filter(e => e.status === 'draft').length,
    acceptedAssignments: assignments.filter(a => a.status === 'accepted').length,
    declinedAssignments: assignments.filter(a => a.status === 'declined').length,
  };

  // Calculs avancés
  const eventCompletionRate = stats.totalEvents > 0 ? ((stats.completedEvents / stats.totalEvents) * 100).toFixed(1) : '0';
  const assignmentAcceptanceRate = stats.totalTechnicians > 0 ? ((stats.acceptedAssignments / (stats.acceptedAssignments + stats.declinedAssignments)) * 100).toFixed(1) : '0';
  const weeklyEvents = events.filter(e => {
    const eventDate = new Date(e.startDate);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return eventDate >= weekStart && eventDate <= weekEnd;
  }).length;

  // Événements récents avec plus de détails
  const upcomingEvents = events
    .filter(e => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  // Événements de cette semaine
  const thisWeekEvents = events.filter(e => {
    const eventDate = new Date(e.startDate);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header compact et professionnel */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-gray-600 mt-1">Vue d'ensemble de votre gestion événementielle</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </button>
              <button
                onClick={() => setShowEventForm(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Événement
              </button>
            </div>
          </div>
        </div>

        {/* Métriques principales compactes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Techniciens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTechnicians}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-gray-900">{eventCompletionRate}%</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acceptation</p>
                <p className="text-2xl font-bold text-gray-900">{assignmentAcceptanceRate}%</p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 ml-1">-2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Section principale avec layout compact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Calendrier */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Calendrier des événements</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Cette semaine: {weeklyEvents} événements</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <EventCalendar
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleCreateFromSlot}
                  onDeleteEvent={handleDeleteEvent}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* Colonne latérale - Actions rapides et événements */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigate('personnel')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Gérer le personnel</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>

                <button
                  onClick={() => handleNavigate('skills')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Star className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-900">Compétences</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>

                <button
                  onClick={() => handleNavigate('assignments')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-900">Affectations</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowEventForm(true)}
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

            {/* Événements à venir */}
            {upcomingEvents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Événements à venir</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(event.startDate), 'dd MMM', { locale: fr })}</span>
                            <MapPin className="h-3 w-3 ml-2" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          event.status === 'published' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status === 'confirmed' ? 'Confirmé' :
                           event.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistiques détaillées */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistiques détaillées</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Événements confirmés</span>
                  <span className="font-medium text-gray-900">{stats.confirmedEvents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Événements en brouillon</span>
                  <span className="font-medium text-gray-900">{stats.draftEvents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Affectations en attente</span>
                  <span className="font-medium text-gray-900">{stats.pendingAssignments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Affectations acceptées</span>
                  <span className="font-medium text-gray-900">{stats.acceptedAssignments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Affectations refusées</span>
                  <span className="font-medium text-gray-900">{stats.declinedAssignments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};