import React, { useState, useEffect } from 'react';
import { Assignment, Event, User } from '../types';
import { Plus, Edit, Trash2, Calendar, User as UserIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

interface AssignmentsManagementProps {
  onNavigate: (page: string) => void;
}

interface AssignmentWithDetails extends Assignment {
  event: Event;
  technician: User;
}

const AssignmentsManagement: React.FC<AssignmentsManagementProps> = ({ onNavigate }) => {
  const { assignments, events, users, addAssignment, updateAssignment, deleteAssignment } = useAppStore();
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

  // Créer les affectations avec détails
  const assignmentsWithDetails: AssignmentWithDetails[] = assignments.map(assignment => {
    const event = events.find(e => e.id === assignment.eventId);
    const technician = users.find(u => u.id === assignment.technicianId);
    
    if (!event || !technician) {
      console.warn(`Affectation ${assignment.id} a des références manquantes:`, { eventId: assignment.eventId, technicianId: assignment.technicianId });
      return null;
    }

    return {
      ...assignment,
      event,
      technician
    };
  }).filter(Boolean) as AssignmentWithDetails[];

  // Fonction pour obtenir les techniciens disponibles pour un événement
  const getAvailableTechnicians = (eventId: string) => {
    if (!eventId || !users.length) return users.filter(u => u.role === 'technician');
    
    // Obtenir les techniciens déjà assignés à cet événement
    const assignedTechnicianIds = assignments
      .filter(assignment => assignment.eventId === eventId)
      .map(assignment => assignment.technicianId);
    
    // Filtrer les techniciens non assignés
    return users.filter(user => 
      user.role === 'technician' && !assignedTechnicianIds.includes(user.id)
    );
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Vérifier si l'affectation existe déjà
      const existingAssignment = assignments.find(
        assignment => 
          assignment.eventId === formData.eventId && 
          assignment.technicianId === formData.technicianId
      );

      if (existingAssignment) {
        toast.error('Ce technicien est déjà assigné à cet événement.');
        return;
      }

      await addAssignment({
        eventId: formData.eventId,
        technicianId: formData.technicianId,
        status: formData.status,
        declineReason: formData.declineReason || undefined,
        responseDate: formData.status !== 'pending' ? new Date() : undefined,
      });

      setShowAddModal(false);
      resetForm();
      toast.success('Affectation créée avec succès !');
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'affectation:', error);
      toast.error(`Erreur lors de l'ajout de l'affectation: ${error.message}`);
    }
  };

  const handleEditAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;

    try {
      await updateAssignment(selectedAssignment.id, {
        status: formData.status,
        declineReason: formData.declineReason || undefined,
        responseDate: formData.status !== 'pending' ? new Date() : undefined,
      });

      setShowEditModal(false);
      setSelectedAssignment(null);
      resetForm();
      toast.success('Affectation mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification de l\'affectation:', error);
      toast.error('Erreur lors de la modification de l\'affectation');
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette affectation ?')) return;

    try {
      await deleteAssignment(assignmentId);
      toast.success('Affectation supprimée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'affectation:', error);
      toast.error('Erreur lors de la suppression de l\'affectation');
    }
  };

  // Fonction pour créer des affectations de test
  const createTestAssignments = async () => {
    try {
      const technicians = users.filter(u => u.role === 'technician');
      const availableEvents = events.filter(e => e.status !== 'draft');
      
      if (technicians.length === 0) {
        toast.error('Aucun technicien disponible pour créer des affectations de test');
        return;
      }
      
      if (availableEvents.length === 0) {
        toast.error('Aucun événement disponible pour créer des affectations de test');
        return;
      }

      // Créer quelques affectations de test
      const testAssignments = [];
      for (let i = 0; i < Math.min(3, availableEvents.length); i++) {
        const event = availableEvents[i];
        const technician = technicians[i % technicians.length];
        
        // Vérifier si l'affectation existe déjà
        const existingAssignment = assignments.find(
          a => a.eventId === event.id && a.technicianId === technician.id
        );
        
        if (!existingAssignment) {
          testAssignments.push({
            eventId: event.id,
            technicianId: technician.id,
            status: 'pending' as const,
          });
        }
      }

      // Créer les affectations
      for (const assignmentData of testAssignments) {
        await addAssignment(assignmentData);
      }

      toast.success(`${testAssignments.length} affectations de test créées avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la création des affectations de test:', error);
      toast.error('Erreur lors de la création des affectations de test');
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

  const filteredAssignments = assignmentsWithDetails.filter(assignment => {
    const matchesSearch = 
      assignment.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${assignment.technician.firstName} ${assignment.technician.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
              <p className="text-2xl font-bold text-gray-900">{assignmentsWithDetails.length}</p>
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
                {assignmentsWithDetails.filter(a => a.status === 'pending').length}
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
                {assignmentsWithDetails.filter(a => a.status === 'accepted').length}
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
                {assignmentsWithDetails.filter(a => a.status === 'declined').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des affectations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {assignmentsWithDetails.length === 0 && (
          <div className="p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune affectation trouvée</h3>
            <p className="text-gray-600 mb-6">
              Créez votre première affectation ou générez des affectations de test pour commencer
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Créer une affectation
              </button>
              <button
                onClick={createTestAssignments}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Créer des affectations de test
              </button>
            </div>
          </div>
        )}
        
        {assignmentsWithDetails.length > 0 && (
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
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Aucune affectation trouvée
                      </p>
                      <p className="text-gray-600">
                        {assignmentsWithDetails.length === 0 
                          ? 'Créez votre première affectation pour commencer'
                          : 'Aucune affectation ne correspond à vos critères de recherche'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
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