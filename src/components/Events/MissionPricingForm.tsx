import React from 'react';
import { Euro, Clock, TrendingUp, Calculator } from 'lucide-react';
import { EventFormData } from '../../types';

interface MissionPricingFormProps {
  pricing: {
    basePrice: number;
    pricePerHour: number;
    bonusPercentage: number;
  };
  onPricingChange: (pricing: {
    basePrice: number;
    pricePerHour: number;
    bonusPercentage: number;
  }) => void;
  eventData: EventFormData;
}

export const MissionPricingForm: React.FC<MissionPricingFormProps> = ({
  pricing,
  onPricingChange,
  eventData,
}) => {
  const handleInputChange = (field: keyof typeof pricing, value: string) => {
    const numValue = parseFloat(value) || 0;
    onPricingChange({
      ...pricing,
      [field]: numValue,
    });
  };

  // Calculer la durée estimée
  const durationHours = eventData.startDate && eventData.endDate
    ? (new Date(eventData.endDate).getTime() - new Date(eventData.startDate).getTime()) / (1000 * 60 * 60)
    : 0;

  // Calculer le prix estimé
  const estimatedPrice = pricing.basePrice + (pricing.pricePerHour * durationHours);
  const estimatedPriceWithBonus = estimatedPrice * (1 + pricing.bonusPercentage / 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Euro className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Forfait de rémunération</h3>
          <p className="text-sm text-gray-600">
            Configurez le tarif de cette mission (visible par les techniciens)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prix de base */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Euro className="inline h-4 w-4 mr-1" />
            Prix de base (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing.basePrice}
            onChange={(e) => handleInputChange('basePrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
          <p className="mt-1 text-xs text-gray-500">
            Montant fixe pour la mission
          </p>
        </div>

        {/* Prix par heure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Prix par heure (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing.pricePerHour}
            onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tarif horaire supplémentaire
          </p>
        </div>

        {/* Bonus pour experts */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TrendingUp className="inline h-4 w-4 mr-1" />
            Bonus experts (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={pricing.bonusPercentage}
            onChange={(e) => handleInputChange('bonusPercentage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.0"
          />
          <p className="mt-1 text-xs text-gray-500">
            Bonus pour techniciens experts
          </p>
        </div>
      </div>

      {/* Calculs estimés */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Calculator className="h-4 w-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-900">Calculs estimés</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Durée estimée:</p>
            <p className="font-medium">{durationHours.toFixed(1)} heures</p>
          </div>
          
          <div>
            <p className="text-gray-600">Prix de base:</p>
            <p className="font-medium">{pricing.basePrice.toFixed(2)}€</p>
          </div>
          
          <div>
            <p className="text-gray-600">Tarif horaire:</p>
            <p className="font-medium">{(pricing.pricePerHour * durationHours).toFixed(2)}€</p>
          </div>
          
          <div>
            <p className="text-gray-600">Prix total estimé:</p>
            <p className="font-medium text-green-600">{estimatedPrice.toFixed(2)}€</p>
          </div>
        </div>

        {pricing.bonusPercentage > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avec bonus experts ({pricing.bonusPercentage}%):</span>
              <span className="text-sm font-medium text-green-600">
                {estimatedPriceWithBonus.toFixed(2)}€
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Informations pour les techniciens */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Ces informations seront visibles par les techniciens sélectionnés 
          pour les aider à prendre leur décision d'acceptation.
        </p>
      </div>
    </div>
  );
}; 