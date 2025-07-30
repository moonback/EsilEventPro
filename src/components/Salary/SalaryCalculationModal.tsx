import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  X, 
  Euro, 
  Clock, 
  Calendar, 
  User, 
  TrendingUp, 
  TrendingDown,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { SalaryCalculation } from '../../types';

interface SalaryCalculationModalProps {
  calculation: SalaryCalculation;
  onClose: () => void;
}

export const SalaryCalculationModal: React.FC<SalaryCalculationModalProps> = ({
  calculation,
  onClose
}) => {
  const totalBonuses = calculation.bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
  const totalDeductions = calculation.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);

  const getBonusIcon = (type: string) => {
    switch (type) {
      case 'overtime': return <Clock className="w-4 h-4" />;
      case 'weekend': return <Calendar className="w-4 h-4" />;
      case 'holiday': return <Calendar className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getDeductionIcon = (type: string) => {
    switch (type) {
      case 'tax': return <FileText className="w-4 h-4" />;
      case 'insurance': return <AlertCircle className="w-4 h-4" />;
      case 'absence': return <Clock className="w-4 h-4" />;
      default: return <TrendingDown className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Euro className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Détail du Calcul de Salaire
              </h2>
              <p className="text-sm text-gray-600">
                {calculation.technicianName} - {format(calculation.period.start, 'dd/MM/yyyy', { locale: fr })} au {format(calculation.period.end, 'dd/MM/yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Technicien</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {calculation.technicianName}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Heures Totales</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {calculation.totalHours}h
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Euro className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Taux Horaire</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {calculation.hourlyRate}€/h
              </p>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Statut :</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(calculation.status)}`}>
              {calculation.status === 'draft' && <Clock className="w-4 h-4 mr-1" />}
              {calculation.status === 'approved' && <CheckCircle className="w-4 h-4 mr-1" />}
              {calculation.status === 'paid' && <Euro className="w-4 h-4 mr-1" />}
              <span className="capitalize">{calculation.status}</span>
            </span>
          </div>

          {/* Affectations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Affectations</h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Événement
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heures
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taux
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {calculation.assignments.map((assignment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.eventTitle}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(assignment.eventDate, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {assignment.hours}h
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {assignment.hourlyRate}€/h
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.total.toFixed(2)}€
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bonus */}
          {calculation.bonuses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bonus</h3>
              <div className="space-y-3">
                {calculation.bonuses.map((bonus) => (
                  <div key={bonus.id} className="flex items-center justify-between bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      {getBonusIcon(bonus.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {bonus.description}
                        </p>
                        {bonus.percentage && (
                          <p className="text-xs text-gray-600">
                            {bonus.percentage}% du salaire de base
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      +{bonus.amount.toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Déductions */}
          {calculation.deductions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Déductions</h3>
              <div className="space-y-3">
                {calculation.deductions.map((deduction) => (
                  <div key={deduction.id} className="flex items-center justify-between bg-red-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      {getDeductionIcon(deduction.type)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {deduction.description}
                        </p>
                        {deduction.percentage && (
                          <p className="text-xs text-gray-600">
                            {deduction.percentage}% du salaire de base
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      -{deduction.amount.toFixed(2)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Résumé */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Salaire de base :</span>
                <span className="font-medium">{calculation.totalSalary.toFixed(2)}€</span>
              </div>
              {totalBonuses > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Bonus :</span>
                  <span className="font-medium text-green-600">+{totalBonuses.toFixed(2)}€</span>
                </div>
              )}
              {totalDeductions > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Déductions :</span>
                  <span className="font-medium text-red-600">-{totalDeductions.toFixed(2)}€</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Salaire Net :</span>
                  <span className="text-lg font-bold text-blue-600">
                    {calculation.netSalary.toFixed(2)}€
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}; 