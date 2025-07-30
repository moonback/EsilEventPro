import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calculator, 
  Download, 
  Upload, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  Users,
  Euro,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { 
  SalaryCalculation, 
  SalaryPeriod, 
  SalarySettings 
} from '../types';
import { salaryService } from '../services/salaryService';
import { SalaryCalculationModal } from '../components/Salary/SalaryCalculationModal';
import { SalarySettingsModal } from '../components/Salary/SalarySettingsModal';
import { SalaryPeriodModal } from '../components/Salary/SalaryPeriodModal';

interface SalaryManagementProps {
  onNavigate: (page: string) => void;
}

export const SalaryManagement: React.FC<SalaryManagementProps> = ({ onNavigate }) => {
  const { events, users, assignments } = useAppStore();
  const [calculations, setCalculations] = useState<SalaryCalculation[]>([]);
  const [periods, setPeriods] = useState<SalaryPeriod[]>([]);
  const [settings, setSettings] = useState<SalarySettings | null>(null);
  const [selectedCalculation, setSelectedCalculation] = useState<SalaryCalculation | null>(null);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  useEffect(() => {
    loadSalaryData();
  }, []);

  const loadSalaryData = () => {
    setCalculations(salaryService.getSalaryCalculations());
    setPeriods(salaryService.getSalaryPeriods());
    setSettings(salaryService.getSalarySettings());
  };

  const handleGenerateSalaries = async () => {
    if (!selectedPeriod) {
      toast.error('Veuillez sélectionner une période');
      return;
    }

    setIsGenerating(true);
    try {
      const technicians = users.filter(u => u.role === 'technician');
      const newCalculations = await salaryService.generateSalariesForPeriod(
        selectedPeriod,
        assignments,
        events,
        technicians
      );

      setCalculations(salaryService.getSalaryCalculations());
      toast.success(`${newCalculations.length} salaires générés avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la génération des salaires:', error);
      toast.error('Erreur lors de la génération des salaires');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewCalculation = (calculation: SalaryCalculation) => {
    setSelectedCalculation(calculation);
    setShowCalculationModal(true);
  };

  const handleUpdateStatus = (id: string, status: 'draft' | 'approved' | 'paid') => {
    salaryService.updateSalaryStatus(id, status);
    setCalculations(salaryService.getSalaryCalculations());
    toast.success('Statut mis à jour avec succès !');
  };

  const handleDeleteCalculation = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce calcul de salaire ?')) {
      salaryService.deleteSalaryCalculation(id);
      setCalculations(salaryService.getSalaryCalculations());
      toast.success('Calcul supprimé avec succès !');
    }
  };

  const handleExportData = () => {
    const data = salaryService.exportSalaryData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salaires_esil_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Données exportées avec succès !');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        salaryService.importSalaryData(data);
        loadSalaryData();
        toast.success('Données importées avec succès !');
      } catch (error) {
        toast.error('Erreur lors de l\'import des données');
      }
    };
    reader.readAsText(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'paid': return <Euro className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const totalNetSalary = calculations.reduce((sum, calc) => sum + calc.netSalary, 0);
  const totalHours = calculations.reduce((sum, calc) => sum + calc.totalHours, 0);
  const pendingCalculations = calculations.filter(c => c.status === 'draft').length;
  const approvedCalculations = calculations.filter(c => c.status === 'approved').length;
  const paidCalculations = calculations.filter(c => c.status === 'paid').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calculator className="w-8 h-8 text-blue-600" />
                Gestion des Salaires
              </h1>
              <p className="text-gray-600 mt-2">
                Génération et gestion des salaires des techniciens
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Retour au Dashboard
            </button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Euro className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salaire Total Net</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalNetSalary.toFixed(2)} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Heures Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calculs en Attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCalculations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Techniciens Payés</p>
                <p className="text-2xl font-bold text-gray-900">{paidCalculations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions principales */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Période de Paie
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une période</option>
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name} ({format(period.startDate, 'dd/MM/yyyy', { locale: fr })} - {format(period.endDate, 'dd/MM/yyyy', { locale: fr })})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateSalaries}
                disabled={!selectedPeriod || isGenerating}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator className="w-4 h-4 mr-2" />
                {isGenerating ? 'Génération...' : 'Générer Salaires'}
              </button>

              <button
                onClick={() => setShowPeriodModal(true)}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Période
              </button>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Import/Export</h3>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter Données
              </button>

              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Importer Données
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Liste des calculs de salaire */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Calculs de Salaires ({calculations.length})
            </h2>
          </div>

          {calculations.length === 0 ? (
            <div className="p-8 text-center">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun calcul de salaire généré</p>
              <p className="text-sm text-gray-400 mt-2">
                Sélectionnez une période et générez les salaires
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Technicien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heures
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salaire Net
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculations.map((calculation) => (
                    <tr key={calculation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {calculation.technicianName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(calculation.period.start, 'dd/MM/yyyy', { locale: fr })} - {format(calculation.period.end, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculation.totalHours}h
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {calculation.netSalary.toFixed(2)} €
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(calculation.status)}`}>
                          {getStatusIcon(calculation.status)}
                          <span className="ml-1 capitalize">{calculation.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCalculation(calculation)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={calculation.status}
                            onChange={(e) => handleUpdateStatus(calculation.id, e.target.value as any)}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="draft">Brouillon</option>
                            <option value="approved">Approuvé</option>
                            <option value="paid">Payé</option>
                          </select>
                          <button
                            onClick={() => handleDeleteCalculation(calculation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCalculationModal && selectedCalculation && (
        <SalaryCalculationModal
          calculation={selectedCalculation}
          onClose={() => {
            setShowCalculationModal(false);
            setSelectedCalculation(null);
          }}
        />
      )}

      {showSettingsModal && (
        <SalarySettingsModal
          settings={settings}
          onClose={() => setShowSettingsModal(false)}
          onSave={(newSettings) => {
            salaryService.updateSalarySettings(newSettings);
            setSettings(salaryService.getSalarySettings());
            setShowSettingsModal(false);
            toast.success('Paramètres mis à jour !');
          }}
        />
      )}

      {showPeriodModal && (
        <SalaryPeriodModal
          onClose={() => setShowPeriodModal(false)}
          onSave={(period) => {
            salaryService.addSalaryPeriod(period);
            setPeriods(salaryService.getSalaryPeriods());
            setShowPeriodModal(false);
            toast.success('Période ajoutée !');
          }}
        />
      )}
    </div>
  );
}; 