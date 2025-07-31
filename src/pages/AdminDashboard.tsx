import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { EventFormData, Event } from '../types';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  BarChart3,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { MetricsCard } from '../components/Dashboard/MetricsCard';
import { MetricsGrid } from '../components/Dashboard/MetricsGrid';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { UpcomingEvents } from '../components/Dashboard/UpcomingEvents';
import { CalendarSection } from '../components/Dashboard/CalendarSection';
import { EventFormModal } from '../components/Dashboard/EventFormModal';
import { useToast } from '../components/Toast';

export const AdminDashboard: React.FC = () => {
  const { events, users, assignments, eventTypes, addEvent, updateEvent, deleteEvent } = useAppStore();
  const { user } = useAuthStore();
  const { success, error } = useToast();
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculer les statistiques
  const stats = {
    totalEvents: events.length,
    totalTechnicians: users.filter(u => u.role === 'technician').length,
    eventCompletionRate: `${Math.round((events.filter(e => e.status === 'completed').length / events.length) * 100) || 0}%`,
    assignmentAcceptanceRate: `${Math.round((assignments.filter(a => a.status === 'accepted').length / assignments.length) * 100) || 0}%`,
  };

  const detailedStats = {
    confirmedEvents: events.filter(e => e.status === 'confirmed').length,
    draftEvents: events.filter(e => e.status === 'draft').length,
    pendingAssignments: assignments.filter(a => a.status === 'pending').length,
    acceptedAssignments: assignments.filter(a => a.status === 'accepted').length,
    declinedAssignments: assignments.filter(a => a.status === 'declined').length,
  };

  const handleCreateEvent = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      await addEvent({ ...data, createdBy: user?.id || '' });
      success('Événement créé', 'L\'événement a été créé avec succès');
      setIsEventFormOpen(false);
    } catch (err) {
      error('Erreur', 'Impossible de créer l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (data: EventFormData) => {
    if (!selectedEvent) return;
    
    setIsLoading(true);
    try {
      await updateEvent(selectedEvent.id, data);
      success('Événement mis à jour', 'L\'événement a été modifié avec succès');
      setSelectedEvent(null);
      setIsEventFormOpen(false);
    } catch (err) {
      error('Erreur', 'Impossible de modifier l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleCreateFromSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteEvent(event.id);
        success('Événement supprimé', 'L\'événement a été supprimé avec succès');
      } catch (err) {
        error('Erreur', 'Impossible de supprimer l\'événement');
      }
    }
  };

  const handleNavigate = (page: string) => {
    // Navigation vers d'autres pages
    console.log('Navigation vers:', page);
  };

  const handleCreateEventClick = () => {
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };

  const handleCancelEventForm = () => {
    setSelectedEvent(null);
    setIsEventFormOpen(false);
  };

  // Événements à venir (prochains 7 jours)
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate >= now && eventDate <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* En-tête du dashboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Tableau de bord
            </h1>
            <p className="text-secondary-600 mt-1">
              Bienvenue, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <button
            onClick={handleCreateEventClick}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Événements totaux"
          value={stats.totalEvents}
          icon={Calendar}
          iconColor="#3b82f6"
          iconBgColor="#dbeafe"
          trend="up"
          trendValue="+12%"
          trendColor="#16a34a"
          subtitle="Ce mois"
        />
        <MetricsCard
          title="Techniciens"
          value={stats.totalTechnicians}
          icon={Users}
          iconColor="#8b5cf6"
          iconBgColor="#ede9fe"
          trend="neutral"
          trendValue="0%"
          trendColor="#64748b"
          subtitle="Actifs"
        />
        <MetricsCard
          title="Taux de complétion"
          value={stats.eventCompletionRate}
          icon={Target}
          iconColor="#f59e0b"
          iconBgColor="#fef3c7"
          trend="up"
          trendValue="+5%"
          trendColor="#16a34a"
          subtitle="Ce mois"
        />
        <MetricsCard
          title="Taux d'acceptation"
          value={stats.assignmentAcceptanceRate}
          icon={Award}
          iconColor="#10b981"
          iconBgColor="#d1fae5"
          trend="up"
          trendValue="+8%"
          trendColor="#16a34a"
          subtitle="Ce mois"
        />
      </div>

      {/* Actions rapides et événements à venir */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actions rapides */}
        <div className="lg:col-span-1">
          <QuickActions
            onNavigate={handleNavigate}
            onCreateEvent={handleCreateEventClick}
          />
        </div>

        {/* Événements à venir */}
        <div className="lg:col-span-2">
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">Statistiques détaillées</h2>
          <p className="text-sm text-secondary-600">Vue d'ensemble de vos activités</p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900">{detailedStats.confirmedEvents}</div>
              <div className="text-sm text-secondary-600">Événements confirmés</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900">{detailedStats.draftEvents}</div>
              <div className="text-sm text-secondary-600">Événements brouillon</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900">{detailedStats.pendingAssignments}</div>
              <div className="text-sm text-secondary-600">Affectations en attente</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-secondary-900">{detailedStats.acceptedAssignments}</div>
              <div className="text-sm text-secondary-600">Affectations acceptées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-secondary-900">Calendrier des événements</h2>
          <p className="text-sm text-secondary-600">Visualisez et gérez vos événements</p>
        </div>
        <div className="card-body">
          <CalendarSection
            weeklyEvents={events.filter(e => {
              const eventDate = new Date(e.startDate);
              const now = new Date();
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= now && eventDate <= weekFromNow;
            }).length}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleCreateFromSlot}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      </div>

      {/* Modal de création/modification d'événement */}
      {isEventFormOpen && (
        <EventFormModal
          selectedEvent={selectedEvent}
          onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={handleCancelEventForm}
          isLoading={isLoading}
          eventTypes={eventTypes}
        />
      )}
    </div>
  );
};