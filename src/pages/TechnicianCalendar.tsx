import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, MapPin, User, Filter, CalendarDays, Eye, FileText, Users, Briefcase } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { Assignment, Event, CalendarEvent } from '../types';
import { format, isPast, isToday, isTomorrow, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import '../styles/technician-calendar.css';

export const TechnicianCalendar: React.FC = () => {
  const { events, assignments, users, updateAssignment } = useAppStore();
  const { user } = useAuthStore();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Affectations pour ce technicien
  const myAssignments = assignments.filter(a => a.technicianId === user?.id);
  
  // Événements avec mes affectations
  const myEvents = events.filter(event => 
    myAssignments.some(assignment => assignment.eventId === event.id)
  ).map(event => ({
    ...event,
    assignment: myAssignments.find(a => a.eventId === event.id)!
  }));

  // Filtrage des événements
  const filteredEvents = myEvents.filter(eventWithAssignment => {
    if (statusFilter === 'all') return true;
    return eventWithAssignment.assignment.status === statusFilter;
  });

  // Générer les jours de la semaine courante
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { locale: fr }),
    end: endOfWeek(currentDate, { locale: fr })
  });

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = startOfWeek(firstDay, { locale: fr });
    const endDate = endOfWeek(lastDay, { locale: fr });
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const monthDays = getDaysInMonth(currentDate);

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
    
    return { label: 'À venir', color: 'bg-green-100 text-green-800', icon: CalendarDays };
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

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(new Date(event.startDate), date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-6 technician-calendar">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Calendrier</h1>
              <p className="text-gray-600">Vue d'ensemble de vos missions et contrats</p>
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

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{myEvents.length}</div>
                <div className="text-sm text-gray-500">Total missions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {myEvents.filter(e => e.assignment.status === 'pending').length}
                </div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {myEvents.filter(e => e.assignment.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-500">Acceptés</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {myEvents.filter(e => isToday(new Date(e.startDate))).length}
                </div>
                <div className="text-sm text-gray-500">Aujourd'hui</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Navigation et vue */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Aujourd'hui
              </button>
              
              <button
                onClick={() => viewMode === 'month' ? navigateMonth('next') : navigateWeek('next')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="text-lg font-semibold text-gray-900">
              {viewMode === 'month' 
                ? format(currentDate, 'MMMM yyyy', { locale: fr })
                : `Semaine du ${format(startOfWeek(currentDate, { locale: fr }), 'dd MMM', { locale: fr })}`
              }
            </div>
          </div>

          {/* Mode de vue et filtres */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Liste
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="accepted">Acceptés</option>
                <option value="declined">Déclinés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du calendrier */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7">
            {monthDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-200 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                  } ${isToday ? 'bg-blue-50' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.map(event => {
                      const status = getEventStatus(event);
                      const assignmentStatus = getAssignmentStatus(event.assignment);
                      const StatusIcon = status.icon;
                      const AssignmentStatusIcon = assignmentStatus.icon;

                      return (
                        <div
                          key={event.id}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            assignmentStatus.color
                          } hover:opacity-80`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <StatusIcon className="h-3 w-3" />
                            <span className="font-medium truncate">{event.title}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <AssignmentStatusIcon className="h-3 w-3" />
                            <span className="truncate">{assignmentStatus.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekDays.map(day => (
              <div key={day.toISOString()} className="p-3 text-center">
                <div className="text-sm font-medium text-gray-700">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={`text-lg font-bold ${
                  isToday(day) ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Grille de la semaine */}
          <div className="grid grid-cols-7">
            {weekDays.map(day => {
              const dayEvents = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[200px] p-3 border-r border-gray-200 ${
                    isToday ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    {dayEvents.map(event => {
                      const status = getEventStatus(event);
                      const assignmentStatus = getAssignmentStatus(event.assignment);
                      const StatusIcon = status.icon;
                      const AssignmentStatusIcon = assignmentStatus.icon;

                      return (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            assignmentStatus.color
                          } hover:opacity-80`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="font-medium text-sm">{event.title}</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <AssignmentStatusIcon className="h-3 w-3" />
                              <span>{assignmentStatus.label}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? 'Vous n\'avez pas encore d\'événements assignés.'
                  : 'Aucun événement ne correspond au filtre sélectionné.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(eventWithAssignment => {
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
      )}

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