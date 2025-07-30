import React, { useState } from 'react';
import { X, Settings, Euro, Clock, Calendar, TrendingUp, FileText } from 'lucide-react';
import { SalarySettings } from '../../types';

interface SalarySettingsModalProps {
  settings: SalarySettings | null;
  onClose: () => void;
  onSave: (settings: SalarySettings) => void;
}

export const SalarySettingsModal: React.FC<SalarySettingsModalProps> = ({
  settings,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<SalarySettings>(
    settings || {
      defaultHourlyRate: 25,
      overtimeMultiplier: 1.5,
      weekendMultiplier: 1.25,
      holidayMultiplier: 2.0,
      taxRate: 0.20,
      insuranceRate: 0.05,
      currency: 'EUR'
    }
  );

  const handleInputChange = (field: keyof SalarySettings, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Paramètres de Salaires
              </h2>
              <p className="text-sm text-gray-600">
                Configuration des taux et multiplicateurs
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Taux de base */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Euro className="w-5 h-5 mr-2" />
              Taux de Base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux horaire par défaut (€/h)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.defaultHourlyRate}
                  onChange={(e) => handleInputChange('defaultHourlyRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Multiplicateurs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Multiplicateurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heures supplémentaires
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.overtimeMultiplier}
                    onChange={(e) => handleInputChange('overtimeMultiplier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">×</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Multiplicateur pour heures &gt; 8h/jour
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week-end
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.weekendMultiplier}
                    onChange={(e) => handleInputChange('weekendMultiplier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">×</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Multiplicateur pour samedi/dimanche
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jours fériés
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={formData.holidayMultiplier}
                    onChange={(e) => handleInputChange('holidayMultiplier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">×</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Multiplicateur pour jours fériés
                </p>
              </div>
            </div>
          </div>

          {/* Déductions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Déductions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux d'imposition (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.taxRate * 100}
                    onChange={(e) => handleInputChange('taxRate', Number(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pourcentage d'impôts sur le revenu
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cotisations sociales (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.insuranceRate * 100}
                    onChange={(e) => handleInputChange('insuranceRate', Number(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pourcentage de cotisations sociales
                </p>
              </div>
            </div>
          </div>

          {/* Aperçu des calculs */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Aperçu des calculs</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Taux horaire de base :</span>
                <span className="font-medium">{formData.defaultHourlyRate}€/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Heures supplémentaires :</span>
                <span className="font-medium">{formData.defaultHourlyRate * formData.overtimeMultiplier}€/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Week-end :</span>
                <span className="font-medium">{formData.defaultHourlyRate * formData.weekendMultiplier}€/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jours fériés :</span>
                <span className="font-medium">{formData.defaultHourlyRate * formData.holidayMultiplier}€/h</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Déductions totales :</span>
                  <span className="font-medium text-red-600">
                    {((formData.taxRate + formData.insuranceRate) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}; 