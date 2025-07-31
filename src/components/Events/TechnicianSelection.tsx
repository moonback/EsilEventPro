import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Award, Users, CheckCircle, XCircle } from 'lucide-react';
import { User, Skill, Event } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface TechnicianSelectionProps {
  event: Event;
  selectedTechnicians: string[];
  onTechniciansChange: (technicianIds: string[]) => void;
  onSelectionReasonChange: (technicianId: string, reason: string) => void;
}

interface TechnicianWithAvailability extends User {
  matchingSkills: Skill[];
  availability: 'available' | 'busy' | 'unknown';
  estimatedPrice: number;
  selectionReason?: string;
}

export const TechnicianSelection: React.FC<TechnicianSelectionProps> = ({
  event,
  selectedTechnicians,
  onTechniciansChange,
  onSelectionReasonChange,
}) => {
  const { users, skills } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [technicians, setTechnicians] = useState<TechnicianWithAvailability[]>([]);

  // Filtrer les techniciens selon les compétences requises
  useEffect(() => {
    const techniciansWithAvailability = users
      .filter(user => user.role === 'technician')
      .map(technician => {
        const matchingSkills = skills.filter(skill => 
          technician.skills.some(userSkill => userSkill.id === skill.id)
        );

        // Vérifier les compétences requises pour l'événement
        const requiredSkills = event.requiredTechnicians.map(req => req.skillId);
        const hasRequiredSkills = requiredSkills.some(skillId =>
          technician.skills.some(skill => skill.id === skillId)
        );

        // Simuler la disponibilité (dans un vrai projet, cela viendrait d'une API)
        const availability = hasRequiredSkills ? 'available' : 'unknown';

        // Calculer le prix estimé (simulation)
        const durationHours = (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60);
        const estimatedPrice = 50 + (25 * durationHours);

        return {
          ...technician,
          matchingSkills,
          availability,
          estimatedPrice,
        };
      });

    setTechnicians(techniciansWithAvailability);
  }, [users, skills, event]);

  // Filtrer les techniciens selon les critères
  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = 
      technician.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technician.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkillFilter = skillFilter === 'all' || 
      technician.matchingSkills.some(skill => skill.id === skillFilter);

    const matchesAvailabilityFilter = availabilityFilter === 'all' || 
      technician.availability === availabilityFilter;

    return matchesSearch && matchesSkillFilter && matchesAvailabilityFilter;
  });

  const handleTechnicianToggle = (technicianId: string) => {
    const newSelection = selectedTechnicians.includes(technicianId)
      ? selectedTechnicians.filter(id => id !== technicianId)
      : [...selectedTechnicians, technicianId];
    
    onTechniciansChange(newSelection);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'busy':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'busy':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un technicien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtre par compétence */}
          <div className="w-full md:w-48">
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les compétences</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par disponibilité */}
          <div className="w-full md:w-48">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les disponibilités</option>
              <option value="available">Disponible</option>
              <option value="busy">Occupé</option>
              <option value="unknown">Inconnu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des techniciens */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Sélection des techniciens ({selectedTechnicians.length} sélectionné(s))
          </h3>
          <p className="text-sm text-gray-600">
            Sélectionnez les techniciens qui recevront une invitation pour cette mission
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTechnicians.map(technician => (
            <div
              key={technician.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                selectedTechnicians.includes(technician.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedTechnicians.includes(technician.id)}
                    onChange={() => handleTechnicianToggle(technician.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />

                  {/* Informations du technicien */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {technician.firstName} {technician.lastName}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(technician.availability)}`}>
                        {getAvailabilityIcon(technician.availability)}
                        <span className="ml-1">
                          {technician.availability === 'available' ? 'Disponible' :
                           technician.availability === 'busy' ? 'Occupé' : 'Inconnu'}
                        </span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">{technician.email}</p>
                    
                    {/* Compétences */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {technician.matchingSkills.map(skill => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>

                    {/* Prix estimé */}
                    <div className="mt-2">
                      <span className="text-sm font-medium text-green-600">
                        ~{technician.estimatedPrice.toFixed(2)}€
                      </span>
                      <span className="text-xs text-gray-500 ml-1">(estimation)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Raison de sélection (si sélectionné) */}
              {selectedTechnicians.includes(technician.id) && (
                <div className="mt-3 pl-8">
                  <textarea
                    placeholder="Raison de la sélection (optionnel)..."
                    value={technician.selectionReason || ''}
                    onChange={(e) => onSelectionReasonChange(technician.id, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTechnicians.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun technicien trouvé avec les critères sélectionnés</p>
          </div>
        )}
      </div>
    </div>
  );
}; 