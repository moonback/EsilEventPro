import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff, Calendar, Loader2, Plus, X, User, Mail, Phone, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { RegisterData, Skill } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { defaultSkills } from '../../config/defaultData';
import toast from 'react-hot-toast';

interface RegisterFormData extends Omit<RegisterData, 'role'> {
  confirmPassword: string;
  selectedSkills: string[];
}

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const skills = defaultSkills; // Utiliser les compétences par défaut
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      selectedSkills: [],
    },
    mode: 'onChange',
  });

  const selectedSkills = watch('selectedSkills');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (data.selectedSkills.length === 0) {
      toast.error('Veuillez sélectionner au moins une compétence');
      return;
    }

    try {
      const selectedSkillObjects = skills.filter(skill => 
        data.selectedSkills.includes(skill.id)
      );

      await registerUser({
        ...data,
        role: 'technician',
        skills: selectedSkillObjects,
      });
      
      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    }
  };

  const addSkill = (skillId: string) => {
    if (!selectedSkills.includes(skillId)) {
      setValue('selectedSkills', [...selectedSkills, skillId]);
    }
  };

  const removeSkill = (skillId: string) => {
    setValue('selectedSkills', selectedSkills.filter(id => id !== skillId));
  };

  const skillCategories = [
    { id: 'sound', name: 'Son', color: 'bg-blue-100 text-blue-800', icon: '🎵' },
    { id: 'lighting', name: 'Éclairage', color: 'bg-yellow-100 text-yellow-800', icon: '💡' },
    { id: 'video', name: 'Vidéo', color: 'bg-purple-100 text-purple-800', icon: '📹' },
    { id: 'general', name: 'Général', color: 'bg-gray-100 text-gray-800', icon: '⚙️' },
    { id: 'stage', name: 'Scène', color: 'bg-green-100 text-green-800', icon: '🎭' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group hover:shadow-xl transition-all duration-300">
            <Calendar className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Inscription Technicien
          </h2>
          <p className="mt-3 text-gray-600 font-medium">
            Rejoignez l'équipe EventPro en tant que technicien
          </p>
          <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full mx-auto"></div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm py-8 px-8 shadow-2xl rounded-2xl border border-white/20">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Informations personnelles</h3>
            <p className="text-gray-600">Créez votre compte technicien</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  Prénom *
                </label>
                <input
                  {...register('firstName', {
                    required: 'Prénom requis',
                    minLength: {
                      value: 2,
                      message: 'Au moins 2 caractères',
                    },
                  })}
                  type="text"
                  autoComplete="given-name"
                  className={`w-full px-4 py-3 pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  placeholder="Votre prénom"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  Nom *
                </label>
                <input
                  {...register('lastName', {
                    required: 'Nom requis',
                    minLength: {
                      value: 2,
                      message: 'Au moins 2 caractères',
                    },
                  })}
                  type="text"
                  autoComplete="family-name"
                  className={`w-full px-4 py-3 pl-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  placeholder="Votre nom"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                Email *
              </label>
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
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                Téléphone
              </label>
              <input
                {...register('phone')}
                type="tel"
                autoComplete="tel"
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-600" />
                  Mot de passe *
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
                    autoComplete="new-password"
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-blue-600" />
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Confirmation du mot de passe requise',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`w-full px-4 py-3 pl-12 pr-12 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Compétences */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-lg font-semibold text-gray-700">
                  Compétences techniques *
                </label>
                <span className="text-sm text-gray-500">
                  {selectedSkills.length} sélectionnée{selectedSkills.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              {selectedSkills.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                    Veuillez sélectionner au moins une compétence
                  </p>
                </div>
              )}
              
              {/* Compétences sélectionnées */}
              {selectedSkills.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-800 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Compétences sélectionnées :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skillId => {
                      const skill = skills.find(s => s.id === skillId);
                      if (!skill) return null;
                      
                      const category = skillCategories.find(cat => cat.id === skill.category);
                      return (
                        <div
                          key={skill.id}
                          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${category?.color} shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <span className="mr-1">{category?.icon}</span>
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-1 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sélection des compétences par catégorie */}
              <div className="space-y-6">
                {skillCategories.map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category.id);
                  
                  return (
                    <div key={category.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 transition-colors">
                      <h4 className={`text-lg font-semibold mb-4 flex items-center ${category.color} px-3 py-2 rounded-lg inline-block`}>
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categorySkills.map(skill => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => addSkill(skill.id)}
                            disabled={selectedSkills.includes(skill.id)}
                            className={`text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                              selectedSkills.includes(skill.id)
                                ? 'bg-blue-100 text-blue-800 cursor-not-allowed shadow-inner'
                                : 'bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700 hover:shadow-md'
                            }`}
                          >
                            <div className="font-semibold">{skill.name}</div>
                            <div className="text-xs text-gray-500 capitalize mt-1">{skill.level}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    S'inscrire en tant que technicien
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 