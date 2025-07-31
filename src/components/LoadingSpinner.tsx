import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Spinner principal */}
        <div className={`spinner ${sizeClasses[size]} border-primary-600`} />
        
        {/* Effet de pulsation */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-primary-200 rounded-full animate-pulse`} />
      </div>
      
      {text && (
        <span className="ml-3 text-sm font-medium text-secondary-600">
          {text}
        </span>
      )}
    </div>
  );
};

// Spinner plein écran
export const FullScreenLoader: React.FC<{ text?: string }> = ({ text = 'Chargement...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 spinner border-primary-600" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-primary-200 rounded-full animate-pulse" />
        </div>
        <p className="text-secondary-600 font-medium">{text}</p>
      </div>
    </div>
  );
};

// Spinner pour boutons
export const ButtonLoader: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 spinner border-white" />
      <span>Traitement...</span>
    </div>
  );
};

// Spinner compact
export const CompactLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <div className={`spinner ${sizeClasses[size]} border-primary-600`} />
  );
};

// Skeleton loader
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-shimmer bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 bg-size-200 rounded ${className}`} />
  );
}; 