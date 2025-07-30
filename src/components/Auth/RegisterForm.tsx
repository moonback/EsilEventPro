import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff, Calendar, Loader2, Plus, X } from 'lucide-react';
import { RegisterData, Skill } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import toast from 'react-hot-toast';

interface RegisterFormData extends Omit<RegisterData, 'role'> {
  confirmPassword: string;
  selectedSkills: string[];
}

export const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const { skills } = useAppStore();
  
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
  });

  const selectedSkills = watch('selectedSkills');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
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
    { id: 'sound', name: 'Son', color: 'bg-blue-100 text-blue-800' },
    { id: 'lighting', name: 'Éclairage', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'video', name: 'Vidéo', color: 'bg-purple-100 text-purple-800' },
    { id: 'general', name: 'Général', color: 'bg-gray-100 text-gray-800' },
    { id: 'stage', name: 'Scène', color: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Inscription Technicien</h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez l'équipe EventPro en tant que technicien
          </p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre prénom"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre nom"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                {...register('phone')}
                type="tel"
                autoComplete="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Mots de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe *
                </label>
                <div className="mt-1 relative">
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
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe *
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Confirmation du mot de passe requise',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Compétences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Compétences techniques *
              </label>
              
              {/* Compétences sélectionnées */}
              {selectedSkills.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Compétences sélectionnées :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skillId => {
                      const skill = skills.find(s => s.id === skillId);
                      if (!skill) return null;
                      
                      const category = skillCategories.find(cat => cat.id === skill.category);
                      return (
                        <div
                          key={skill.id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category?.color}`}
                        >
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill.id)}
                            className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
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
              <div className="space-y-4">
                {skillCategories.map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category.id);
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className={`text-sm font-medium mb-3 ${category.color} px-2 py-1 rounded inline-block`}>
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {categorySkills.map(skill => (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => addSkill(skill.id)}
                            disabled={selectedSkills.includes(skill.id)}
                            className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedSkills.includes(skill.id)
                                ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <div className="font-medium">{skill.name}</div>
                            <div className="text-xs text-gray-500 capitalize">{skill.level}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {errors.selectedSkills && (
                <p className="mt-1 text-sm text-red-600">{errors.selectedSkills.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'S\'inscrire en tant que technicien'
                )}
              </button>
            </div>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="font-medium text-blue-600 hover:text-blue-500"
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