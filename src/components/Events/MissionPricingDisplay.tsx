import React, { useState, useEffect } from 'react';
import { Euro, Clock, TrendingUp, Calculator, Eye, AlertCircle } from 'lucide-react';
import { MissionPricing, Event } from '../../types';
import { missionPricingService } from '../../services/supabaseService';
import { useAuthStore } from '../../store/useAuthStore';

interface MissionPricingDisplayProps {
  pricing: MissionPricing;
  event: Event;
  technicianLevel?: 'beginner' | 'intermediate' | 'expert';
  showDetails?: boolean;
}

export const MissionPricingDisplay: React.FC<MissionPricingDisplayProps> = ({
  pricing,
  event,
  technicianLevel = 'intermediate',
  showDetails = true,
}) => {
  const { user } = useAuthStore();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculer la durée en heures
  const durationHours = (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60);
  
  // Calculer le prix de base (méthode locale)
  const basePrice = pricing.basePrice;
  const hourlyPrice = pricing.pricePerHour * durationHours;
  const totalPrice = basePrice + hourlyPrice;
  
  // Appliquer le bonus pour les experts
  const hasExpertBonus = technicianLevel === 'expert' && pricing.bonusPercentage > 0;
  const bonusAmount = hasExpertBonus ? totalPrice * (pricing.bonusPercentage / 100) : 0;
  const localFinalPrice = totalPrice + bonusAmount;

  // Récupérer le prix calculé par la fonction SQL
  useEffect(() => {
    const fetchCalculatedPrice = async () => {
      if (!user || !event.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const price = await missionPricingService.calculateMissionPrice(event.id, user.id);
        setCalculatedPrice(price);
      } catch (err) {
        console.error('Erreur lors du calcul du prix:', err);
        setError('Erreur lors du calcul du prix');
        setCalculatedPrice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalculatedPrice();
  }, [event.id, user?.id]);

  // Utiliser le prix calculé par SQL ou le prix local
  const finalPrice = calculatedPrice !== null ? calculatedPrice : localFinalPrice;
  const priceSource = calculatedPrice !== null ? 'SQL' : 'local';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
          <Euro className="h-3 w-3 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Rémunération de la mission</h3>
      </div>

      {/* Prix final mis en évidence */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-green-800">Rémunération totale</span>
          <div className="text-right">
            {isLoading ? (
              <span className="text-lg text-gray-500">Calcul en cours...</span>
            ) : (
              <span className="text-2xl font-bold text-green-600">{finalPrice.toFixed(2)}€</span>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-2 flex items-center text-xs text-red-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="mt-2 text-xs text-green-600">
            {priceSource === 'SQL' ? 'Prix calculé par le système' : 'Prix estimé localement'}
            {hasExpertBonus && ` • Inclut un bonus de ${pricing.bonusPercentage}% pour votre niveau expert`}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="space-y-3">
          {/* Détails du calcul */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
              <Calculator className="h-4 w-4 mr-1" />
              Détails du calcul
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Prix de base:</span>
                <span className="font-medium">{basePrice.toFixed(2)}€</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tarif horaire ({durationHours.toFixed(1)}h × {pricing.pricePerHour}€):</span>
                <span className="font-medium">{hourlyPrice.toFixed(2)}€</span>
              </div>
              
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-900 font-medium">Sous-total:</span>
                <span className="font-medium">{totalPrice.toFixed(2)}€</span>
              </div>
              
              {hasExpertBonus && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bonus expert ({pricing.bonusPercentage}%):</span>
                    <span className="font-medium text-green-600">+{bonusAmount.toFixed(2)}€</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-900 font-medium">Total final:</span>
                    <span className="font-medium text-green-600">{finalPrice.toFixed(2)}€</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Informations sur la mission */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Informations mission
            </h4>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Durée:</span>
                <span className="font-medium">{durationHours.toFixed(1)} heures</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-700">Tarif horaire:</span>
                <span className="font-medium">{pricing.pricePerHour}€/h</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-blue-700">Votre niveau:</span>
                <span className="font-medium capitalize">{technicianLevel}</span>
              </div>
            </div>
          </div>

          {/* Note importante */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> Cette rémunération est une estimation basée sur les informations 
              de la mission. Le montant final peut varier selon les conditions spécifiques de l'événement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 