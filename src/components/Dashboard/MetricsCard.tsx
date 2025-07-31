import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  trendColor: string;
  subtitle?: string;
  onClick?: () => void;
  loading?: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
  trendValue,
  trendColor,
  subtitle,
  onClick,
  loading = false,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  const getTrendText = () => {
    if (trend === 'up') return 'Augmentation';
    if (trend === 'down') return 'Diminution';
    return 'Stable';
  };

  return (
    <div 
      className={`dashboard-metric group cursor-pointer transition-all duration-300 ${
        onClick ? 'hover:scale-105 hover:shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Contenu principal */}
      <div className="relative z-10">
        {/* En-tête avec icône */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon 
              className="w-6 h-6 transition-all duration-300 group-hover:rotate-12" 
              style={{ color: iconColor }}
            />
          </div>
          
          {/* Indicateur de tendance */}
          <div className="flex items-center space-x-1">
            <span 
              className="text-lg font-bold transition-all duration-300 group-hover:scale-110"
              style={{ color: trendColor }}
            >
              {getTrendIcon()}
            </span>
          </div>
        </div>

        {/* Valeur principale */}
        <div className="mb-2">
          {loading ? (
            <div className="skeleton h-8 w-24 rounded-md mb-2" />
          ) : (
            <div className="text-3xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors duration-300">
              {value}
            </div>
          )}
        </div>

        {/* Titre */}
        <div className="mb-1">
          <h3 className="text-sm font-semibold text-secondary-700 group-hover:text-secondary-900 transition-colors duration-300">
            {title}
          </h3>
        </div>

        {/* Sous-titre et tendance */}
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className="text-xs text-secondary-500 group-hover:text-secondary-600 transition-colors duration-300">
              {subtitle}
            </p>
          )}
          
          <div className="flex items-center space-x-1">
            <span 
              className="text-xs font-medium transition-all duration-300"
              style={{ color: trendColor }}
            >
              {trendValue}
            </span>
            <span className="text-xs text-secondary-400">
              {getTrendText()}
            </span>
          </div>
        </div>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
    </div>
  );
}; 