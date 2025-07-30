import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Assignment, Event } from '../types';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const TechnicianDashboard: React.FC = () => {
  const { events, assignments, users, addAssignment, updateAssignment, loadInitialData } = useAppStore();
  const { user } = useAuthStore();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [declineReason, setDeclineReason] = useState('');

  useEffect(() => {
    loadInitialData();
    // Simuler des affectations pour ce technicien à des fins de démonstration
    if (user && events.length > 0) {
      const existingAssignments = assignments.filter(a => a.technicianId === user.id);
      if (existingAssignments.length === 0) {
        // Créer quelques affectations d'exemple
        events.slice(0, 3).forEach(event => {
          addAssignment({
            eventId: event.id,
            technicianId: user.id,
            status: 'pending',
          });
        });
      }
    }
  }, [user, events.length]);

  // Affectations pour ce technicien
  const myAssignments = assignments.filter(a => a.technicianId === user?.id);
  
  // Événements avec mes affectations
  const myEvents = events.filter(event => 
    myAssignments.some(assignment => assignment.eventId === event.id)
  ).map(event => ({
    ...event,
    assignment: myAssignments.find(a => a.eventId === event.id)!
  }));

  // Statistiques
  const stats = {
    total: myAssignments.length,
    pending: myAssignments.filter(a => a.status === 'pending').length,
    accepted: myAssignments.filter(a => a.status === 'accepted').length,
    declined: myAssignments.filter(a => a.status === 'declined').length,
  };

  const handleAcceptAssignment = (assignment: Assignment) => {
    updateAssignment(assignment.id, {
      status: 'accepted',
      responseDate: new Date(),
    });
    toast.success('Mission acceptée !');
  };

  const handleDeclineAssignment = (assignment: Assignment, reason: string) => {
    updateAssignment(assignment.id, {
      status: 'declined',
      responseDate: new Date(),
      declineReason: reason,
    });
    setSelectedAssignment(null);
    setDeclineReason('');
    toast.success('Réponse enregistrée');
  };

  const getEventStatus = (event: Event & { assignment: Assignment }) => {
    const eventDate = new Date(event.startDate);
    
    if (isPast(eventDate)) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-800' };
    }
    
    if (isToday(eventDate)) {
      return { label: "Aujourd'hui", color: 'bg-blue-100 text-blue-800' };
    }
    
    if (isTomorrow(eventDate)) {
      return { label: 'Demain', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    return { label: 'À venir', color: 'bg-green-100 text-green-800' };
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    switch (assignment.status) {
      case 'accepted':
        return { label: 'Acceptée', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'declined':
        return { label: 'Déclinée', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Missions</h1>
          <p className="text-gray-600">
            Gérez vos affectations et disponibilités
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">Technicien</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Missions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Déclinées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.declined}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des missions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Mes affectations</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {myEvents.length > 0 ? (
            myEvents.map(event => {
              const eventStatus = getEventStatus(event);
              const assignmentStatus = getAssignmentStatus(event.assignment);
              const StatusIcon = assignmentStatus.icon;

              return (
                <div key={event.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventStatus.color}`}>
                          {eventStatus.label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${assignmentStatus.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {assignmentStatus.label}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{event.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(event.startDate), 'dd MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      </div>

                      {event.assignment.status === 'declined' && event.assignment.declineReason && (
                        <div className="mt-3 p-3 bg-red-50 rounded-md">
                          <p className="text-sm text-red-800">
                            <strong>Raison du refus :</strong> {event.assignment.declineReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {event.assignment.status === 'pending' && !isPast(new Date(event.startDate)) && (
                      <div className="flex items-center space-x-3 ml-6">
                        <button
                          onClick={() => handleAcceptAssignment(event.assignment)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accepter</span>
                        </button>
                        <button
                          onClick={() => setSelectedAssignment(event.assignment)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Décliner</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune mission assignée</h3>
              <p className="text-gray-600">
                Vous n'avez actuellement aucune mission assignée. Les nouvelles affectations apparaîtront ici.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de refus */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Décliner la mission
            </h3>
            <p className="text-gray-600 mb-4">
              Veuillez indiquer la raison de votre refus :
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={3}
              placeholder="Raison du refus..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setDeclineReason('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeclineAssignment(selectedAssignment, declineReason)}
                disabled={!declineReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};