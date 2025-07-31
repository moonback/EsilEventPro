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

import { EventFormModal } from '../components/Dashboard/EventFormModal';

// Composant pour les métriques compactes
const CompactMetrics: React.FC<{ stats: any }> = ({ stats }) => {
  const metrics = [
    {
      title: "Complétion",
      value: `${stats.eventCompletionRate}%`,
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      color: "green"
    },
    {
      title: "Acceptation",
      value: `${stats.assignmentAcceptanceRate}%`,
      icon: <Award className="h-4 w-4 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Cette semaine",
      value: stats.weeklyEvents,
      icon: <Calendar className="h-4 w-4 text-purple-600" />,
      color: "purple"
    },
    {
      title: "Techniciens actifs",
      value: stats.activeTechnicians,
      icon: <Users className="h-4 w-4 text-indigo-600" />,
      color: "indigo"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-md bg-${metric.color}-100`}>
                {metric.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant pour les alertes compactes
const CompactAlerts: React.FC<{ alerts: any[] }> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Alertes</h3>
        <Bell className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 2).map((alert, index) => (
          <div key={index} className={`flex items-start space-x-2 p-2 rounded-md text-xs ${
            alert.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
            alert.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            <div className={`mt-0.5 ${
              alert.type === 'warning' ? 'text-amber-600' :
              alert.type === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {alert.type === 'warning' ? <AlertTriangle className="h-3 w-3" /> :
               alert.type === 'error' ? <XCircle className="h-3 w-3" /> :
               <CheckCircle className="h-3 w-3" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{alert.title}</p>
              <p className="text-gray-600">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour les actions rapides compactes
const CompactQuickActions: React.FC<{ onNavigate: (page: string) => void; onCreateEvent: () => void }> = ({ 
  onNavigate, 
  onCreateEvent 
}) => {
  const actions = [
    {
      title: "Personnel",
      icon: <Users className="h-4 w-4" />,
      color: "blue",
      action: () => onNavigate('personnel')
    },
    {
      title: "Compétences",
      icon: <Award className="h-4 w-4" />,
      color: "purple",
      action: () => onNavigate('skills')
    },
    {
      title: "Affectations",
      icon: <Target className="h-4 w-4" />,
      color: "green",
      action: () => onNavigate('assignments')
    },
    {
      title: "Nouvel événement",
      icon: <Plus className="h-4 w-4" />,
      color: "indigo",
      action: onCreateEvent
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Actions rapides</h3>
        <Zap className="h-4 w-4 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`p-2 rounded-md border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-200 text-left group`}
          >
            <div className={`inline-flex items-center justify-center w-6 h-6 rounded-md bg-${action.color}-100 text-${action.color}-600 mb-1 group-hover:bg-${action.color}-200 transition-colors duration-200`}>
              {action.icon}
            </div>
            <p className="text-xs font-medium text-gray-900">{action.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
};



// Composant pour les statistiques détaillées
const DetailedStatsPanel: React.FC<{ stats: any }> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Statistiques détaillées</h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Événements confirmés:</span>
          <span className="font-medium">{stats.confirmedEvents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">En brouillon:</span>
          <span className="font-medium">{stats.draftEvents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Affectations en attente:</span>
          <span className="font-medium">{stats.pendingAssignments}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Affectations acceptées:</span>
          <span className="font-medium">{stats.acceptedAssignments}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Événements en retard:</span>
          <span className="font-medium text-red-600">{stats.overdueEvents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Durée moyenne:</span>
          <span className="font-medium">{stats.averageEventDuration}h</span>
        </div>
      </div>

      {/* Top types d'événements */}
      {stats.topEventTypes && stats.topEventTypes.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Types populaires</h4>
          <div className="space-y-1">
            {stats.topEventTypes.map((type: any, index: number) => (
              <div key={type.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{type.name}</span>
                </div>
                <span className="text-xs font-medium">{type.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
    dateRange: 'all',
    location: '',
    technician: ''
  });



  // Sauvegarde automatique des filtres
  useEffect(() => {
    localStorage.setItem('adminDashboardFilters', JSON.stringify(calendarFilters));
  }, [calendarFilters]);

  // Restauration des filtres au chargement
  useEffect(() => {
    const savedFilters = localStorage.getItem('adminDashboardFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setCalendarFilters(prev => ({ ...prev, ...parsedFilters }));
      } catch (error) {
        console.error('Erreur lors de la restauration des filtres:', error);
      }
    }
  }, []);

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

    // Nouvelles statistiques
    const overdueEvents = events.filter(e => 
      new Date(e.startDate) < new Date() && e.status !== 'completed' && e.status !== 'cancelled'
    ).length;

    const averageEventDuration = events.length > 0 ? 
      events.reduce((acc, event) => {
        const duration = (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60);
        return acc + duration;
      }, 0) / events.length : 0;

    const topEventTypes = useAppStore.getState().eventTypes.map(type => ({
      ...type,
      count: events.filter(e => e.type?.id === type.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 3);

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
      activeTechnicians,
      overdueEvents,
      averageEventDuration: averageEventDuration.toFixed(1),
      topEventTypes
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

    // Alertes pour les événements en retard
    const overdueEvents = events.filter(e => 
      new Date(e.startDate) < new Date() && e.status !== 'completed' && e.status !== 'cancelled'
    );
    
    if (overdueEvents.length > 0) {
      alertsList.push({
        type: 'error',
        title: 'Événements en retard',
        message: `${overdueEvents.length} événement(s) sont en retard`
      });
    }

    // Alertes pour les techniciens surchargés
    const overloadedTechnicians = users.filter(u => 
      u.role === 'technician' && 
      assignments.filter(a => a.technicianId === u.id && a.status === 'accepted').length > 5
    );
    
    if (overloadedTechnicians.length > 0) {
      alertsList.push({
        type: 'warning',
        title: 'Techniciens surchargés',
        message: `${overloadedTechnicians.length} technicien(s) ont plus de 5 affectations`
      });
    }
    
    return alertsList;
  }, [stats, events, assignments, users]);

  // Événements filtrés pour le calendrier
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesStatus = !calendarFilters.status || event.status === calendarFilters.status;
      const matchesType = !calendarFilters.type || event.type?.id === calendarFilters.type;
      const matchesSearch = !calendarFilters.search || 
        event.title.toLowerCase().includes(calendarFilters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(calendarFilters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(calendarFilters.search.toLowerCase());
      const matchesLocation = !calendarFilters.location || 
        event.location.toLowerCase().includes(calendarFilters.location.toLowerCase());
      const matchesTechnician = !calendarFilters.technician || 
        event.assignments.some(assignment => {
          const technician = users.find(u => u.id === assignment.technicianId);
          return technician && (
            technician.firstName.toLowerCase().includes(calendarFilters.technician.toLowerCase()) ||
            technician.lastName.toLowerCase().includes(calendarFilters.technician.toLowerCase())
          );
        });
      
      return matchesStatus && matchesType && matchesSearch && matchesLocation && matchesTechnician;
    });
  }, [events, calendarFilters, users]);

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
    try {
      // Créer un fichier CSV avec les événements
      const csvContent = [
        ['Titre', 'Date de début', 'Date de fin', 'Lieu', 'Statut', 'Type', 'Description'],
        ...filteredEvents.map(event => [
          event.title,
          format(new Date(event.startDate), 'dd/MM/yyyy HH:mm'),
          format(new Date(event.endDate), 'dd/MM/yyyy HH:mm'),
          event.location,
          event.status,
          event.type?.name || '',
          event.description
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `calendrier_events_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export du calendrier réussi !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export du calendrier');
    }
  }, [filteredEvents]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + N pour nouveau événement
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        handleCreateEventClick();
      }
      
      // Ctrl/Cmd + E pour export
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        handleExportCalendar();
      }
      
      // Échap pour fermer les modales
      if (event.key === 'Escape') {
        if (showEventForm) {
          handleCancelEventForm();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleCreateEventClick, handleExportCalendar, showEventForm, handleCancelEventForm]);

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
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header compact */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-600">Gérez vos événements et votre équipe technique</p>
            </div>
            <button
              onClick={handleCreateEventClick}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvel événement</span>
              <span className="text-xs opacity-75">Ctrl+N</span>
            </button>
          </div>
        </div>

        {/* Métriques compactes */}
        <CompactMetrics stats={stats} />



        {/* Section principale avec layout optimisé */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          {/* Colonne principale - Calendrier (4 colonnes sur xl) */}
          <div className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Calendrier des événements</h3>
                      <p className="text-xs text-gray-600">
                        {stats.weeklyEvents} événements cette semaine • {stats.totalEvents} au total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Confirmés</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      <span>En attente</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Brouillons</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <EnhancedCalendar
                  events={filteredEvents}
                  onSelectEvent={handleSelectEvent}
                  onSelectSlot={handleCreateFromSlot}
                  onDeleteEvent={handleDeleteEvent}
                  onExportCalendar={handleExportCalendar}
                  height={700}
                  showFilters={true}
                  // showMiniMap={false}
                  showQuickActions={true}
                />
              </div>
            </div>
          </div>

          {/* Colonne latérale compacte (1 colonne sur xl) */}
          <div className="xl:col-span-1 space-y-4">
            {/* Actions rapides compactes */}
            <CompactQuickActions
              onNavigate={handleNavigate}
              onCreateEvent={handleCreateEventClick}
            />

            {/* Alertes compactes */}
            <CompactAlerts alerts={alerts} />

            {/* Statistiques détaillées compactes */}
            <DetailedStatsPanel stats={stats} />

            {/* Événements à venir compactes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Événements à venir</h3>
              <div className="space-y-2">
                {filteredEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-600">{format(new Date(event.startDate), 'dd/MM HH:mm')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};