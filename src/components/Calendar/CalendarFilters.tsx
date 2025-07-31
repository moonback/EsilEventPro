import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface CalendarFiltersProps {
  filters: {
    status: string;
    type: string;
    search: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
  stats: {
    total: number;
    today: number;
    thisWeek: number;
    byStatus: Record<string, number>;
  };
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFiltersChange,
  stats,
}) => {
  const { eventTypes } = useAppStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', icon: FileText },
    { value: 'draft', label: 'Brouillons', icon: FileText, count: stats.byStatus.draft || 0 },
    { value: 'published', label: 'Publiés', icon: AlertCircle, count: stats.byStatus.published || 0 },
    { value: 'confirmed', label: 'Confirmés', icon: CheckCircle, count: stats.byStatus.confirmed || 0 },
    { value: 'completed', label: 'Terminés', icon: CheckCircle, count: stats.byStatus.completed || 0 },
    { value: 'cancelled', label: 'Annulés', icon: XCircle, count: stats.byStatus.cancelled || 0 },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'tomorrow', label: 'Demain' },
    { value: 'thisWeek', label: 'Cette semaine' },
    { value: 'nextWeek', label: 'Semaine prochaine' },
    { value: 'thisMonth', label: 'Ce mois' },
    { value: 'nextMonth', label: 'Mois prochain' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      search: '',
      dateRange: 'all',
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                         filters.type !== 'all' || 
                         filters.search !== '' || 
                         filters.dateRange !== 'all';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* En-tête des filtres */}
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Effacer</span>
            </button>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Total: {stats.total}</span>
          <span>•</span>
          <span>Aujourd'hui: {stats.today}</span>
          <span>•</span>
          <span>Cette semaine: {stats.thisWeek}</span>
        </div>
      </div>

      {/* Filtres principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtre par statut */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} {option.count && option.count > 0 && `(${option.count})`}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par type */}
        <div>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les types</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par période */}
        <div>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>Filtres avancés</span>
          <svg
            className={`h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtres supplémentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Filtrer par lieu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Techniciens requis
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Tous</option>
                  <option value="1">1 technicien</option>
                  <option value="2">2 techniciens</option>
                  <option value="3+">3+ techniciens</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Toutes les durées</option>
                  <option value="short">Court (&lt; 2h)</option>
                  <option value="medium">Moyen (2-4h)</option>
                  <option value="long">Long (&gt; 4h)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Statut: {statusOptions.find(s => s.value === filters.status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.type !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Type: {eventTypes.find(t => t.id === filters.type)?.name}
              <button
                onClick={() => handleFilterChange('type', 'all')}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              Recherche: "{filters.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-1 hover:text-yellow-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Période: {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 