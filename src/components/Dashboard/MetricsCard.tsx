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
    <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
      {/* Gradient overlay au hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trendColor} ${trend === 'up' ? 'bg-green-50' : 'bg-red-50'}`}>
              <TrendIcon className="h-3 w-3" />
              <span>{trendValue}</span>
            </div>
          </div>
          
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        
        <div className={`w-14 h-14 ${iconBgColor} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300`}>
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>
      </div>
      
      {/* Indicateur de progression */}
      <div className="relative mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: trend === 'up' ? '75%' : '45%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 