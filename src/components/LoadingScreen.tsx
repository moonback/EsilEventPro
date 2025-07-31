import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Logo animé */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <Sparkles className="h-10 w-10 text-white animate-bounce" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-30 animate-pulse" />
        </div>

        {/* Titre */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold gradient-text">
            Esil-Events
          </h1>
          <p className="text-secondary-600 text-sm">
            Gestion Événementielle
          </p>
        </div>

        {/* Spinner */}
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
          <span className="text-secondary-600 font-medium">
            Chargement...
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-64 h-1 bg-secondary-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse" 
               style={{ width: '60%' }} />
        </div>

        {/* Points de chargement */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}; 