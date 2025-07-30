import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Calendar, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { LoginCredentials } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      toast.success('Connexion réussie !');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group hover:shadow-xl transition-all duration-300">
            <Calendar className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            EventPro
          </h2>
          <p className="mt-3 text-gray-600 font-medium">
            Gestion d'événements professionnelle
          </p>
          <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full mx-auto"></div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm py-8 px-8 shadow-2xl rounded-2xl border border-white/20">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h3>
            <p className="text-gray-600">Accédez à votre espace de travail</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                Adresse email
              </label>
              <div className="relative">
                <input
                  {...register('email', {
                    required: 'Email requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-3 pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  placeholder="votre.email@example.com"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-blue-600" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Mot de passe requis',
                    minLength: {
                      value: 6,
                      message: 'Au moins 6 caractères',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            
            
            {/* Lien vers l'inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nouveau technicien ?{' '}
                <button
                  type="button"
                  onClick={() => window.location.href = '/register'}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2"
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};