import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, XCircle } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

const toastStyles = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-600',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
  },
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

  const style = toastStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-200 ${
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${style.bgColor} ${style.borderColor} border rounded-lg shadow-lg p-4 max-w-sm`}>
        <div className="flex items-start space-x-3">
          <div className={`${style.iconColor} flex-shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${style.textColor}`}>{title}</h4>
            {message && (
              <p className={`text-sm ${style.textColor} opacity-80 mt-1`}>{message}</p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className={`${style.textColor} opacity-60 hover:opacity-100 transition-opacity duration-200`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook pour gérer les toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>>([]);

  const addToast = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
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
    success,
    error,
    warning,
    info,
    removeToast,
  };
};

// Composant ToastContainer
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}; 