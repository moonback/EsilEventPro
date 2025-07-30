import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User, MapPin, CalendarDays, TrendingUp, Filter, SortAsc, FileText, Eye, Users, Briefcase } from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');

  useEffect(() => {
    // Les données sont maintenant chargées automatiquement dans App.tsx
    // Les affectations seront gérées par l'administrateur via l'interface
  }, []);

  // Affectations pour ce technicien
  const myAssignments = assignments.filter(a => a.technicianId === user?.id);
  
  // Événements avec mes affectations
  const myEvents = events.filter(event => 
    myAssignments.some(assignment => assignment.eventId === event.id)
  ).map(event => ({
    ...event,
    assignment: myAssignments.find(a => a.eventId === event.id)!
  }));

  // Filtrage et tri des événements assignés
  const filteredAndSortedEvents = myEvents
    .filter(eventWithAssignment => {
      if (statusFilter === 'all') return true;
      return eventWithAssignment.assignment.status === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        // Tri par statut : pending > accepted > declined
        const statusOrder = { pending: 0, accepted: 1, declined: 2 };
        return statusOrder[a.assignment.status as keyof typeof statusOrder] - 
               statusOrder[b.assignment.status as keyof typeof statusOrder];
      }
    });

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
    toast.success('Contrat accepté avec succès !');
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

  const getEventStatus = (event: Event & { assignment?: Assignment }) => {
    const eventDate = new Date(event.startDate);
    
    if (isPast(eventDate)) {
      return { label: 'Terminé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
    }
    
    if (isToday(eventDate)) {
      return { label: "Aujourd'hui", color: 'bg-blue-100 text-blue-800', icon: Calendar };
    }
    
    if (isTomorrow(eventDate)) {
      return { label: 'Demain', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    }
    
    return { label: 'À venir', color: 'bg-green-100 text-green-800', icon: TrendingUp };
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    switch (assignment.status) {
      case 'accepted':
        return { label: 'Accepté', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'declined':
        return { label: 'Décliné', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    }
  };

  const getRequiredSkills = (event: Event) => {
    if (!event.requiredTechnicians || event.requiredTechnicians.length === 0) {
      return 'Aucune compétence spécifique requise';
    }
    
    return event.requiredTechnicians.map(req => {
      const skill = useAppStore.getState().skills.find(s => s.id === req.skillId);
      return `${skill?.name || 'Compétence inconnue'} (${req.count})`;
    }).join(', ');
  };

  return (
    <div className="space-y-8">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Technicien</h1>
              <p className="text-gray-600">Gérez vos missions et découvrez les nouvelles opportunités</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Mes contrats</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                <div className="text-sm text-gray-500">En attente</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.accepted}</div>
                <div className="text-sm text-gray-500">Acceptés</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.declined}</div>
                <div className="text-sm text-gray-500">Déclinés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et tri pour les contrats assignés */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrer par :</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les contrats</option>
                <option value="pending">En attente</option>
                <option value="accepted">Acceptés</option>
                <option value="declined">Déclinés</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="status">Statut</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contrats assignés */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Mes Contrats</span>
          </h2>
          <span className="text-sm text-gray-500">
            {filteredAndSortedEvents.length} contrat{filteredAndSortedEvents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredAndSortedEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {statusFilter === 'all' ? 'Aucun contrat pour le moment' : 'Aucun contrat avec ce statut'}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'Vous recevrez des notifications quand de nouveaux contrats vous seront assignés.'
                : 'Aucun contrat ne correspond au filtre sélectionné.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((eventWithAssignment) => {
              const event = eventWithAssignment;
              const assignment = eventWithAssignment.assignment;
              const status = getEventStatus(eventWithAssignment);
              const assignmentStatus = getAssignmentStatus(assignment);
              const StatusIcon = status.icon;
              const AssignmentStatusIcon = assignmentStatus.icon;

              return (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.color}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${assignmentStatus.color}`}>
                        <AssignmentStatusIcon className="h-3 w-3 inline mr-1" />
                        {assignmentStatus.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.startDate), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}</span>
                    </div>

                    {event.description && (
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-2">{event.description}</p>
                      </div>
                    )}

                    {assignment.declineReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">
                          <strong>Raison du refus :</strong> {assignment.declineReason}
                        </p>
                      </div>
                    )}

                    {assignment.status === 'pending' && (
                      <div className="flex space-x-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleAcceptAssignment(assignment)}
                          className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Accepter
                        </button>
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Décliner
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de refus */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Décliner le contrat</h3>
            <p className="text-gray-600 mb-4">
              Veuillez indiquer la raison de votre refus (optionnel) :
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Raison du refus..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setDeclineReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeclineAssignment(selectedAssignment, declineReason)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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