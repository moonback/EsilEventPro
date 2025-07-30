import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Event, EventFormData } from '../types';
import PersonnelManagement from './PersonnelManagement';
import SkillsManagement from './SkillsManagement';
import AssignmentsManagement from './AssignmentsManagement';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { MetricsGrid } from '../components/Dashboard/MetricsGrid';
import { CalendarSection } from '../components/Dashboard/CalendarSection';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { UpcomingEvents } from '../components/Dashboard/UpcomingEvents';
import { DetailedStats } from '../components/Dashboard/DetailedStats';
import { EventFormModal } from '../components/Dashboard/EventFormModal';

export const AdminDashboard: React.FC = () => {
  const { events, users, assignments, addEvent, updateEvent, deleteEvent } = useAppStore();
  const { user } = useAuthStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'personnel' | 'skills' | 'assignments'>('dashboard');

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

  const handleCreateEventClick = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

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
        {/* Header compact et professionnel */}
        <DashboardHeader onCreateEvent={handleCreateEventClick} />

        {/* Métriques principales compactes */}
        <MetricsGrid
          stats={{
            totalEvents: stats.totalEvents,
            totalTechnicians: stats.totalTechnicians,
            eventCompletionRate,
            assignmentAcceptanceRate,
          }}
        />

        {/* Section principale avec layout compact */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Colonne principale - Calendrier (3 colonnes sur xl) */}
          <div className="xl:col-span-3">
            <CalendarSection
              weeklyEvents={weeklyEvents}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleCreateFromSlot}
              onDeleteEvent={handleDeleteEvent}
            />
          </div>

          {/* Colonne latérale - Actions rapides et événements (2 colonnes sur xl) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Actions rapides */}
            <QuickActions
              onNavigate={handleNavigate}
              onCreateEvent={handleCreateEventClick}
            />

            {/* Événements à venir */}
            <UpcomingEvents events={upcomingEvents} />

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
          </div>
        </div>
      </div>
    </div>
  );
};