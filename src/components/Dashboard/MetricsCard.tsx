import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend: 'up' | 'down';
  trendValue: string;
  trendColor: string;
  subtitle?: string;
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
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="group relative bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      {/* Gradient overlay au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-600 truncate">{title}</p>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trendColor} ${trend === 'up' ? 'bg-green-50' : 'bg-red-50'}`}>
              <TrendIcon className="h-3 w-3" />
              <span className="text-xs">{trendValue}</span>
            </div>
          </div>
          
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>
        
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 ml-3 flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      
      {/* Indicateur de progression compact */}
      <div className="relative mt-3">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: trend === 'up' ? '75%' : '45%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 