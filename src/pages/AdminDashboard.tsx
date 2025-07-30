import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, AlertCircle, TrendingUp, UserPlus, Settings, Briefcase } from 'lucide-react';
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
  const { events, users, assignments, addEvent, updateEvent, loadInitialData } = useAppStore();
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
      type: eventType,
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

  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
  };

  if (showEventForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h1>
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

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex space-x-1 p-1">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setCurrentPage('personnel')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 'personnel'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Personnel
          </button>
          <button
            onClick={() => setCurrentPage('skills')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 'skills'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Compétences
          </button>
          <button
            onClick={() => setCurrentPage('assignments')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === 'assignments'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Affectations
          </button>
        </div>
      </div>

      {/* Contenu des pages */}
      {currentPage === 'personnel' && (
        <PersonnelManagement onNavigate={handleNavigate} />
      )}

      {currentPage === 'skills' && (
        <SkillsManagement onNavigate={handleNavigate} />
      )}

      {currentPage === 'assignments' && (
        <AssignmentsManagement onNavigate={handleNavigate} />
      )}

      {currentPage === 'dashboard' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h1>
              <p className="text-gray-600">
                Vue d'ensemble de vos événements et équipes
              </p>
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Nouvel événement</span>
            </button>
          </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Événements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Techniciens</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTechnicians}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">À venir</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcommingEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2">
          <EventCalendar
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleCreateFromSlot}
            height={500}
          />
        </div>

        {/* Événements à venir */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Événements à venir</h3>
          </div>
          
          <div className="p-6">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(event.startDate), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'published'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.status === 'confirmed' ? 'Confirmé' : 
                           event.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement à venir</p>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Créer votre premier événement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};