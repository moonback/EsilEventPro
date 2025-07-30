import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Assignment, Event, User } from '../types';
import { Plus, Edit, Trash2, Calendar, User as UserIcon, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AssignmentsManagementProps {
  onNavigate: (page: string) => void;
}

interface AssignmentWithDetails extends Assignment {
  event: Event;
  technician: User;
}

const AssignmentsManagement: React.FC<AssignmentsManagementProps> = ({ onNavigate }) => {
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // États pour le formulaire
  const [formData, setFormData] = useState({
    eventId: '',
    technicianId: '',
    status: 'pending' as 'pending' | 'accepted' | 'declined',
    declineReason: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchEvents();
    fetchTechnicians();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          events (
            id,
            title,
            start_date,
            end_date,
            location,
            status
          ),
          users!assignments_technician_id_fkey (
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAssignments: AssignmentWithDetails[] = data?.map((assignment: any) => ({
        id: assignment.id,
        eventId: assignment.event_id,
        technicianId: assignment.technician_id,
        status: assignment.status,
        responseDate: assignment.response_date ? new Date(assignment.response_date) : undefined,
        declineReason: assignment.decline_reason,
        createdAt: new Date(assignment.created_at),
        event: {
          id: assignment.events.id,
          title: assignment.events.title,
          description: '',
          startDate: new Date(assignment.events.start_date),
          endDate: new Date(assignment.events.end_date),
          location: assignment.events.location,
          type: { id: '', name: '', color: '', defaultDuration: 0 },
          requiredTechnicians: [],
          assignments: [],
          status: assignment.events.status,
          createdBy: '',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        technician: {
          id: assignment.users.id,
          email: assignment.users.email,
          firstName: assignment.users.first_name,
          lastName: assignment.users.last_name,
          role: assignment.users.role,
          skills: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })) || [];

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Erreur lors du chargement des affectations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      const formattedEvents: Event[] = data?.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        location: event.location,
        type: { id: '', name: '', color: '', defaultDuration: 0 },
        requiredTechnicians: [],
        assignments: [],
        status: event.status,
        createdBy: event.created_by,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at)
      })) || [];

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'technician')
        .order('first_name');

      if (error) throw error;

      const formattedTechnicians: User[] = data?.map((user: any) => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        phone: user.phone,
        skills: [],
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at)
      })) || [];

      setTechnicians(formattedTechnicians);
    } catch (error) {
      console.error('Erreur lors du chargement des techniciens:', error);
    }
  };

  // Fonction pour obtenir les techniciens disponibles pour un événement
  const getAvailableTechnicians = (eventId: string) => {
    if (!eventId || !technicians.length) return technicians;
    
    // Obtenir les techniciens déjà assignés à cet événement
    const assignedTechnicianIds = assignments
      .filter(assignment => assignment.eventId === eventId)
      .map(assignment => assignment.technicianId);
    
    // Filtrer les techniciens non assignés
    return technicians.filter(technician => 
      !assignedTechnicianIds.includes(technician.id)
    );
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Vérifier si l'affectation existe déjà en utilisant les données locales
      const existingAssignment = assignments.find(
        assignment => 
          assignment.eventId === formData.eventId && 
          assignment.technicianId === formData.technicianId
      );

      if (existingAssignment) {
        alert('Ce technicien est déjà assigné à cet événement.');
        return;
      }

      const { error } = await supabase
        .from('assignments')
        .insert({
          event_id: formData.eventId,
          technician_id: formData.technicianId,
          status: formData.status,
          decline_reason: formData.declineReason || null
        });

      if (error) throw error;

      setShowAddModal(false);
      resetForm();
      fetchAssignments();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'affectation:', error);
      
      if (error.code === '23505') {
        alert('Ce technicien est déjà assigné à cet événement.');
      } else {
        alert(`Erreur lors de l'ajout de l'affectation: ${error.message}`);
      }
    }
  };

  const handleEditAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          status: formData.status,
          decline_reason: formData.declineReason || null,
          response_date: formData.status !== 'pending' ? new Date().toISOString() : null
        })
        .eq('id', selectedAssignment.id);

      if (error) throw error;

      setShowEditModal(false);
      setSelectedAssignment(null);
      resetForm();
      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors de la modification de l\'affectation:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;

      fetchAssignments();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'affectation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      eventId: '',
      technicianId: '',
      status: 'pending',
      declineReason: ''
    });
  };

  const openEditModal = (assignment: AssignmentWithDetails) => {
    setSelectedAssignment(assignment);
    setFormData({
      eventId: assignment.eventId,
      technicianId: assignment.technicianId,
      status: assignment.status,
      declineReason: assignment.declineReason || ''
    });
    setShowEditModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Acceptée';
      case 'declined':
        return 'Refusée';
      case 'pending':
      default:
        return 'En attente';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${assignment.technician.firstName} ${assignment.technician.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Affectations</h1>
          <p className="text-gray-600">Gérez les affectations de techniciens aux événements</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle affectation
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une affectation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="accepted">Acceptées</option>
            <option value="declined">Refusées</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Acceptées</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'accepted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Refusées</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'declined').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des affectations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de réponse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.event.location} • {assignment.event.startDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.technician.firstName} {assignment.technician.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.technician.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">{getStatusText(assignment.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.responseDate ? assignment.responseDate.toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(assignment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle affectation</h2>
            <form onSubmit={handleAddAssignment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Événement</label>
                  <select
                    required
                    value={formData.eventId}
                    onChange={(e) => {
                      const newEventId = e.target.value;
                      setFormData({
                        ...formData, 
                        eventId: newEventId,
                        technicianId: '' // Réinitialiser le technicien quand l'événement change
                      });
                    }}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un événement</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {event.startDate.toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Technicien</label>
                  <select
                    required
                    value={formData.technicianId}
                    onChange={(e) => setFormData({...formData, technicianId: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={getAvailableTechnicians(formData.eventId).length === 0}
                  >
                    <option value="">
                      {getAvailableTechnicians(formData.eventId).length === 0 
                        ? "Aucun technicien disponible" 
                        : "Sélectionner un technicien"}
                    </option>
                    {getAvailableTechnicians(formData.eventId).map((technician) => (
                      <option key={technician.id} value={technician.id}>
                        {technician.firstName} {technician.lastName}
                      </option>
                    ))}
                  </select>
                  {getAvailableTechnicians(formData.eventId).length === 0 && formData.eventId && (
                    <p className="mt-1 text-sm text-orange-600">
                      Tous les techniciens sont déjà assignés à cet événement.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut initial</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="accepted">Acceptée</option>
                    <option value="declined">Refusée</option>
                  </select>
                </div>
                {formData.status === 'declined' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Raison du refus</label>
                    <textarea
                      value={formData.declineReason}
                      onChange={(e) => setFormData({...formData, declineReason: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier l'affectation</h2>
            <form onSubmit={handleEditAssignment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Événement</label>
                  <input
                    type="text"
                    value={selectedAssignment.event.title}
                    disabled
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Technicien</label>
                  <input
                    type="text"
                    value={`${selectedAssignment.technician.firstName} ${selectedAssignment.technician.lastName}`}
                    disabled
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="accepted">Acceptée</option>
                    <option value="declined">Refusée</option>
                  </select>
                </div>
                {formData.status === 'declined' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Raison du refus</label>
                    <textarea
                      value={formData.declineReason}
                      onChange={(e) => setFormData({...formData, declineReason: e.target.value})}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsManagement; 