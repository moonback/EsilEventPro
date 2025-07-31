import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { startOfWeek, endOfWeek, format, subDays, addDays, isToday, isThisWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Event, EventFormData } from '../types';
import PersonnelManagement from './PersonnelManagement';
import SkillsManagement from './SkillsManagement';
import AssignmentsManagement from './AssignmentsManagement';
import { EnhancedCalendar } from '../components/Calendar/EnhancedCalendar';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { MetricsGrid } from '../components/Dashboard/MetricsGrid';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { UpcomingEvents } from '../components/Dashboard/UpcomingEvents';
import { DetailedStats } from '../components/Dashboard/DetailedStats';
import { EventFormModal } from '../components/Dashboard/EventFormModal';

// Composant pour les métriques avancées
const AdvancedMetrics: React.FC<{ stats: any }> = ({ stats }) => {
  const metrics = [
    {
      title: "Taux de complétion",
      value: `${stats.eventCompletionRate}%`,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      change: "+2.5%",
      changeType: "positive",
      color: "green"
    },
    {
      title: "Taux d'acceptation",
      value: `${stats.assignmentAcceptanceRate}%`,
      icon: <Award className="h-5 w-5 text-blue-600" />,
      change: "+1.8%",
      changeType: "positive",
      color: "blue"
    },
    {
      title: "Événements cette semaine",
      value: stats.weeklyEvents,
      icon: <Calendar className="h-5 w-5 text-purple-600" />,
      change: "+3",
      changeType: "positive",
      color: "purple"
    },
    {
      title: "Techniciens actifs",
      value: stats.activeTechnicians,
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      change: "+1",
      changeType: "positive",
      color: "indigo"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant pour les alertes et notifications
const AlertsPanel: React.FC<{ alerts: any[] }> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alertes</h3>
        <Bell className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
            alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
            alert.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className={`mt-1 ${
              alert.type === 'warning' ? 'text-amber-600' :
              alert.type === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
               alert.type === 'error' ? <XCircle className="h-4 w-4" /> :
               <CheckCircle className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{alert.title}</p>
              <p className="text-xs text-gray-600">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour les actions rapides avancées
const AdvancedQuickActions: React.FC<{ onNavigate: (page: string) => void; onCreateEvent: () => void }> = ({ 
  onNavigate, 
  onCreateEvent 
}) => {
  const actions = [
    {
      title: "Gestion du personnel",
      description: "Gérer les techniciens et leurs profils",
      icon: <Users className="h-5 w-5" />,
      color: "blue",
      action: () => onNavigate('personnel')
    },
    {
      title: "Gestion des compétences",
      description: "Configurer les compétences et spécialités",
      icon: <Award className="h-5 w-5" />,
      color: "purple",
      action: () => onNavigate('skills')
    },
    {
      title: "Affectations",
      description: "Gérer les affectations d'équipe",
      icon: <Target className="h-5 w-5" />,
      color: "green",
      action: () => onNavigate('assignments')
    },
    {
      title: "Nouvel événement",
      description: "Créer un nouvel événement",
      icon: <Plus className="h-5 w-5" />,
      color: "indigo",
      action: onCreateEvent
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
        <Zap className="h-5 w-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`p-3 rounded-lg border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-200 text-left group`}
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-${action.color}-100 text-${action.color}-600 mb-2 group-hover:bg-${action.color}-200 transition-colors duration-200`}>
              {action.icon}
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">{action.title}</h4>
            <p className="text-xs text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { events, users, assignments, addEvent, updateEvent, deleteEvent } = useAppStore();
  const { user } = useAuthStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'personnel' | 'skills' | 'assignments'>('dashboard');
  const [calendarFilters, setCalendarFilters] = useState({
    status: '',
    type: '',
    search: '',
    dateRange: 'all'
  });

  // Statistiques avancées avec calculs en temps réel
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const totalTechnicians = users.filter(u => u.role === 'technician').length;
    const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).length;
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const confirmedEvents = events.filter(e => e.status === 'confirmed').length;
    const draftEvents = events.filter(e => e.status === 'draft').length;
    const acceptedAssignments = assignments.filter(a => a.status === 'accepted').length;
    const declinedAssignments = assignments.filter(a => a.status === 'declined').length;
    
    // Calculs avancés
    const eventCompletionRate = totalEvents > 0 ? ((completedEvents / totalEvents) * 100).toFixed(1) : '0';
    const assignmentAcceptanceRate = (acceptedAssignments + declinedAssignments) > 0 ? 
      ((acceptedAssignments / (acceptedAssignments + declinedAssignments)) * 100).toFixed(1) : '0';
    
    const weeklyEvents = events.filter(e => {
      const eventDate = new Date(e.startDate);
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      return eventDate >= weekStart && eventDate <= weekEnd;
    }).length;

    const activeTechnicians = users.filter(u => 
      u.role === 'technician' && 
      assignments.some(a => a.technicianId === u.id && a.status === 'accepted')
    ).length;

    return {
      totalEvents,
      totalTechnicians,
      upcomingEvents,
      pendingAssignments,
      completedEvents,
      confirmedEvents,
      draftEvents,
      acceptedAssignments,
      declinedAssignments,
      eventCompletionRate,
      assignmentAcceptanceRate,
      weeklyEvents,
      activeTechnicians
    };
  }, [events, users, assignments]);

  // Alertes en temps réel
  const alerts = useMemo(() => {
    const alertsList = [];
    
    if (stats.pendingAssignments > 5) {
      alertsList.push({
        type: 'warning',
        title: 'Affectations en attente',
        message: `${stats.pendingAssignments} affectations nécessitent une attention immédiate`
      });
    }
    
    if (stats.draftEvents > 10) {
      alertsList.push({
        type: 'warning',
        title: 'Événements en brouillon',
        message: `${stats.draftEvents} événements sont encore en brouillon`
      });
    }
    
    if (Number(stats.eventCompletionRate) < 80) {
      alertsList.push({
        type: 'error',
        title: 'Taux de complétion faible',
        message: `Le taux de complétion est de ${stats.eventCompletionRate}%`
      });
    }
    
    return alertsList;
  }, [stats]);

  // Événements filtrés pour le calendrier
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesStatus = !calendarFilters.status || event.status === calendarFilters.status;
      const matchesType = !calendarFilters.type || event.type?.name === calendarFilters.type;
      const matchesSearch = !calendarFilters.search || 
        event.title.toLowerCase().includes(calendarFilters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(calendarFilters.search.toLowerCase());
      
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [events, calendarFilters]);

  const handleCreateEvent = useCallback((data: EventFormData) => {
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
  }, [addEvent, user]);

  const handleUpdateEvent = useCallback((data: EventFormData) => {
    if (!selectedEvent) return;

    const eventType = useAppStore.getState().eventTypes.find(t => t.id === data.typeId);
    if (!eventType) return;

    updateEvent(selectedEvent.id, {
      ...data,
    });

    setSelectedEvent(null);
    setShowEventForm(false);
    toast.success('Événement mis à jour !');
  }, [selectedEvent, updateEvent]);

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  }, []);

  const handleCreateFromSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setShowEventForm(true);
  }, []);

  const handleDeleteEvent = useCallback(async (event: Event) => {
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
  }, [deleteEvent]);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as any);
  }, []);

  const handleCreateEventClick = useCallback(() => {
    setSelectedEvent(null);
    setShowEventForm(true);
  }, []);

  const handleCancelEventForm = useCallback(() => {
    setShowEventForm(false);
    setSelectedEvent(null);
  }, []);

  const handleExportCalendar = useCallback(() => {
    toast.success('Export du calendrier en cours...');
    // Logique d'export à implémenter
  }, []);

  if (showEventForm) {
    return (
      <EventFormModal
        selectedEvent={selectedEvent}
        onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        onCancel={handleCancelEventForm}
      />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header amélioré */}
        <DashboardHeader onCreateEvent={handleCreateEventClick} />

        {/* Métriques avancées */}
        <AdvancedMetrics stats={stats} />

        {/* Section principale avec layout amélioré */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Colonne principale - Calendrier amélioré (3 colonnes sur xl) */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Calendrier des événements</h3>
                      <p className="text-sm text-gray-600">
                        {stats.weeklyEvents} événements cette semaine • {stats.totalEvents} au total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Confirmés</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>En attente</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Brouillons</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <EnhancedCalendar
                  events={filteredEvents}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleCreateFromSlot}
                  onDeleteEvent={handleDeleteEvent}
                  onExportCalendar={handleExportCalendar}
                  height={600}
                  showFilters={true}
                  showMiniMap={true}
                  showQuickActions={true}
                />
              </div>
            </div>
          </div>

          {/* Colonne latérale - Actions et alertes (1 colonne sur xl) */}
          <div className="xl:col-span-1 space-y-6">
            {/* Actions rapides avancées */}
            <AdvancedQuickActions
              onNavigate={handleNavigate}
              onCreateEvent={handleCreateEventClick}
            />

            {/* Alertes et notifications */}
            {alerts.length > 0 && (
              <AlertsPanel alerts={alerts} />
            )}

            {/* Statistiques détaillées */}
            <DetailedStats
              stats={{
                confirmedEvents: stats.confirmedEvents,
                draftEvents: stats.draftEvents,
                pendingAssignments: stats.pendingAssignments,
                acceptedAssignments: stats.acceptedAssignments,
                declinedAssignments: stats.declinedAssignments,
              }}
            />

            {/* Événements à venir */}
            <UpcomingEvents events={filteredEvents.slice(0, 3)} />
          </div>
        </div>
      </div>
    </div>
  );
};