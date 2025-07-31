import React, { useState } from 'react';
import { EnhancedCalendar } from '../components/Calendar/EnhancedCalendar';
import { useAppStore } from '../store/useAppStore';
import { Event } from '../types';
import { useToast } from '../components/Toast';

export const EnhancedCalendarPage: React.FC = () => {
  const { events } = useAppStore();
  const { success, error } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    success('Événement sélectionné', `${event.title} - ${event.location}`);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    success('Créneau sélectionné', `Du ${slotInfo.start.toLocaleString()} au ${slotInfo.end.toLocaleString()}`);
  };

  const handleDeleteEvent = (event: Event) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${event.title}" ?`)) {
      // Logique de suppression
      success('Événement supprimé', `${event.title} a été supprimé avec succès`);
    }
  };

  const handleExportCalendar = () => {
    // Logique d'export
    success('Export réussi', 'Le calendrier a été exporté avec succès');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calendrier Professionnel
          </h1>
          <p className="text-gray-600">
            Gestion avancée des événements avec filtres, statistiques et navigation intuitive
          </p>
        </div>

        {/* Calendrier amélioré */}
        <EnhancedCalendar
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onDeleteEvent={handleDeleteEvent}
          onExportCalendar={handleExportCalendar}
          height={800}
          showFilters={true}
          showMiniMap={true}
          showQuickActions={true}
        />

        {/* Détails de l'événement sélectionné */}
        {selectedEvent && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Détails de l'événement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Titre :</strong> {selectedEvent.title}</p>
                  <p><strong>Description :</strong> {selectedEvent.description}</p>
                  <p><strong>Lieu :</strong> {selectedEvent.location}</p>
                  <p><strong>Statut :</strong> {selectedEvent.status}</p>
                  <p><strong>Type :</strong> {selectedEvent.type.name}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Horaires</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Début :</strong> {selectedEvent.startDate.toLocaleString()}</p>
                  <p><strong>Fin :</strong> {selectedEvent.endDate.toLocaleString()}</p>
                  <p><strong>Durée :</strong> {
                    Math.round((selectedEvent.endDate.getTime() - selectedEvent.startDate.getTime()) / (1000 * 60 * 60))
                  } heures</p>
                </div>
              </div>
            </div>
            
            {selectedEvent.requiredTechnicians && selectedEvent.requiredTechnicians.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">Techniciens requis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedEvent.requiredTechnicians.map((req, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900">
                        {req.count} technicien(s) - Niveau {req.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistiques supplémentaires */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total événements</h3>
            <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Événements confirmés</h3>
            <p className="text-3xl font-bold text-green-600">
              {events.filter(e => e.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Événements en attente</h3>
            <p className="text-3xl font-bold text-orange-600">
              {events.filter(e => e.status === 'published').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Événements annulés</h3>
            <p className="text-3xl font-bold text-red-600">
              {events.filter(e => e.status === 'cancelled').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 