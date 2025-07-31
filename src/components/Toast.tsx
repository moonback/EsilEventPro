import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-success-600" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-error-600" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-warning-600" />;
    case 'info':
      return <Info className="h-5 w-5 text-primary-600" />;
    default:
      return <Info className="h-5 w-5 text-primary-600" />;
  }
};

const getToastStyles = (type: string) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-success-50',
        border: 'border-success-200',
        iconBg: 'bg-success-100',
      };
    case 'error':
      return {
        bg: 'bg-error-50',
        border: 'border-error-200',
        iconBg: 'bg-error-100',
      };
    case 'warning':
      return {
        bg: 'bg-warning-50',
        border: 'border-warning-200',
        iconBg: 'bg-warning-100',
      };
    case 'info':
      return {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        iconBg: 'bg-primary-100',
      };
    default:
      return {
        bg: 'bg-primary-50',
        border: 'border-primary-200',
        iconBg: 'bg-primary-100',
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const styles = getToastStyles(type);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fermeture
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div
        className={`${styles.bg} ${styles.border} border rounded-xl shadow-xl p-4 max-w-sm w-full backdrop-blur-sm`}
      >
        <div className="flex items-start space-x-3">
          {/* Icône */}
          <div className={`${styles.iconBg} rounded-lg p-2 flex-shrink-0`}>
            {getToastIcon(type)}
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-secondary-900 mb-1">
              {title}
            </h3>
            {message && (
              <p className="text-sm text-secondary-600 leading-relaxed">
                {message}
              </p>
            )}
          </div>

          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Barre de progression */}
        <div className="mt-3 h-1 bg-secondary-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-linear"
            style={{
              width: isLeaving ? '0%' : '100%',
              transitionDuration: isLeaving ? '300ms' : `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Hook pour gérer les toasts
interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = { id, type, title, message, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message?: string, duration?: number) => {
    addToast('success', title, message, duration);
  };

  const error = (title: string, message?: string, duration?: number) => {
    addToast('error', title, message, duration);
  };

  const warning = (title: string, message?: string, duration?: number) => {
    addToast('warning', title, message, duration);
  };

  const info = (title: string, message?: string, duration?: number) => {
    addToast('info', title, message, duration);
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

// Container pour afficher tous les toasts
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300 ease-out"
          style={{
            transform: `translateY(${index * 80}px)`,
          }}
        >
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}; 