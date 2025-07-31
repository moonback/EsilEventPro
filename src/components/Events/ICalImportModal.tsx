import React, { useState, useRef } from 'react';
import { Upload, FileText, Calendar, MapPin, Clock, X, Check, AlertCircle } from 'lucide-react';
import { ICalEvent, icalService } from '../../services/icalService';
import { EventFormData } from '../../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ICalImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (events: EventFormData[]) => void;
  eventTypes: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export const ICalImportModal: React.FC<ICalImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  eventTypes,
  isLoading = false,
}) => {
  const [parsedEvents, setParsedEvents] = useState<ICalEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [selectedTypeId, setSelectedTypeId] = useState<string>(eventTypes[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.name.toLowerCase().endsWith('.ics') && !file.name.toLowerCase().endsWith('.ical')) {
      setError('Veuillez sélectionner un fichier .ics ou .ical valide');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const events = await icalService.parseFile(file);
      setParsedEvents(events);
      // Sélectionner tous les événements valides par défaut
      const validEvents = events.filter(event => icalService.validateEvent(event).isValid);
      setSelectedEvents(new Set(validEvents.map(event => event.uid)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du parsing du fichier');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAll = () => {
    const validEvents = parsedEvents.filter(event => icalService.validateEvent(event).isValid);
    setSelectedEvents(new Set(validEvents.map(event => event.uid)));
  };

  const handleDeselectAll = () => {
    setSelectedEvents(new Set());
  };

  const handleToggleEvent = (uid: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(uid)) {
      newSelected.delete(uid);
    } else {
      newSelected.add(uid);
    }
    setSelectedEvents(newSelected);
  };

  const handleImport = () => {
    const eventsToImport = parsedEvents
      .filter(event => selectedEvents.has(event.uid))
      .map(event => icalService.convertToEventFormData(event, selectedTypeId));

    onImport(eventsToImport);
    handleClose();
  };

  const handleClose = () => {
    setParsedEvents([]);
    setSelectedEvents(new Set());
    setError('');
    setSelectedTypeId(eventTypes[0]?.id || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getEventStatus = (event: ICalEvent) => {
    const validation = icalService.validateEvent(event);
    if (!validation.isValid) {
      return { isValid: false, errors: validation.errors };
    }
    return { isValid: true, errors: [] };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Importer des événements depuis un fichier iCal
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Glissez-déposez votre fichier .ics ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500">
                Formats supportés: .ics, .ical (Google Calendar, Outlook, etc.)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics,.ical"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Traitement...' : 'Sélectionner un fichier'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Type Selection */}
          {parsedEvents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'événement par défaut
              </label>
              <select
                value={selectedTypeId}
                onChange={(e) => setSelectedTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Events Preview */}
          {parsedEvents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">
                  Événements trouvés ({parsedEvents.length})
                </h4>
                <div className="space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Tout sélectionner
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    Tout désélectionner
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {parsedEvents.map((event) => {
                  const status = getEventStatus(event);
                  const isSelected = selectedEvents.has(event.uid);
                  
                  return (
                    <div
                      key={event.uid}
                      className={`border rounded-lg p-4 ${
                        status.isValid
                          ? isSelected
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 bg-white'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleEvent(event.uid)}
                            disabled={!status.isValid}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              {event.summary}
                            </h5>
                            {status.isValid ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            {event.description && (
                              <p className="truncate">{event.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(event.startDate, 'dd/MM/yyyy', { locale: fr })}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {format(event.startDate, 'HH:mm', { locale: fr })} - {format(event.endDate, 'HH:mm', { locale: fr })}
                                </span>
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {!status.isValid && (
                            <div className="mt-2">
                              <p className="text-xs text-red-600 font-medium">Erreurs:</p>
                              <ul className="text-xs text-red-600 list-disc list-inside">
                                {status.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {parsedEvents.length > 0 && (
              <span>
                {selectedEvents.size} événement(s) sélectionné(s) sur {parsedEvents.length}
              </span>
            )}
          </div>
          
          <div className="space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              disabled={selectedEvents.size === 0 || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Import en cours...' : `Importer ${selectedEvents.size} événement(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 