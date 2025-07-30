import { useState, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export const useSupabaseError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown) => {
    let errorMessage = 'Une erreur inattendue s\'est produite';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    // Gestion spécifique des erreurs Supabase
    if (error && typeof error === 'object' && 'code' in error) {
      const supabaseError = error as PostgrestError;
      
      switch (supabaseError.code) {
        case 'PGRST116':
          errorMessage = 'Données non trouvées';
          break;
        case '23505':
          errorMessage = 'Cette entrée existe déjà';
          break;
        case '23503':
          errorMessage = 'Impossible de supprimer : références existantes';
          break;
        case '42501':
          errorMessage = 'Permission refusée';
          break;
        case '42P01':
          errorMessage = 'Table non trouvée';
          break;
        default:
          errorMessage = supabaseError.message || errorMessage;
      }
    }

    setError(errorMessage);
    toast.error(errorMessage);
    
    console.error('Erreur Supabase:', error);
    
    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}; 