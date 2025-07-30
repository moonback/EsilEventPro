import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X, CheckCircle, XCircle, AlertTriangle, Briefcase, Award, Clock, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { User as UserType, Skill } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { userSkillsService } from '../services/supabaseService';

export const TechnicianProfile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { skills, updateUser: updateUserInStore } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // État des compétences
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user?.skills?.map(skill => skill.id) || []
  );

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSelectedSkills(user.skills?.map(skill => skill.id) || []);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Validation des mots de passe si changement
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }
        if (formData.newPassword.length < 6) {
          toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
          return;
        }
      }

      // Préparer les données de mise à jour
      const updateData: Partial<UserType> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      };

      // Ajouter le mot de passe si fourni
      if (formData.newPassword) {
        (updateData as any).password = formData.newPassword;
      }

      // Mettre à jour l'utilisateur
      await updateUserInStore(user.id, updateData);

      // Mettre à jour les compétences si nécessaire
      if (JSON.stringify(selectedSkills.sort()) !== JSON.stringify(user.skills?.map(s => s.id).sort())) {
        try {
          await userSkillsService.updateUserSkills(user.id, selectedSkills);
          
          // Mettre à jour l'utilisateur local avec les nouvelles compétences
          const updatedSkills = skills.filter(skill => selectedSkills.includes(skill.id));
          const updatedUser = { ...user, skills: updatedSkills };
          updateUser(updatedUser);
          
          toast.success('Compétences mises à jour avec succès');
        } catch (error) {
          console.error('Erreur lors de la mise à jour des compétences:', error);
          toast.error('Erreur lors de la mise à jour des compétences');
        }
      }

      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSelectedSkills(user.skills?.map(skill => skill.id) || []);
    }
    setIsEditing(false);
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillCategoryIcon = (category: string) => {
    switch (category) {
      case 'sound': return '🔊';
      case 'lighting': return '💡';
      case 'video': return '📹';
      case 'stage': return '🎭';
      default: return '⚙️';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Utilisateur non connecté</h3>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-12xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles et compétences</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 inline mr-2" />
                Annuler
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 inline mr-2" />
                Modifier
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations personnelles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Informations personnelles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Changement de mot de passe */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Laisser vide pour ne pas changer"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* Compétences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-600" />
              Mes Compétences
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez vos compétences techniques :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <label
                      key={skill.id}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedSkills.includes(skill.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.id)}
                        onChange={() => handleSkillToggle(skill.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getSkillCategoryIcon(skill.category)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{skill.name}</div>
                          <div className="text-sm text-gray-500">{skill.category}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {user.skills && user.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {user.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <span className="text-lg mr-3">{getSkillCategoryIcon(skill.category)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{skill.name}</div>
                          <div className="text-sm text-gray-500">{skill.category}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune compétence</h3>
                    <p className="text-gray-600">Vous n'avez pas encore ajouté de compétences à votre profil</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statistiques et informations */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Statistiques
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Contrats totaux</div>
                    <div className="text-sm text-gray-500">Tous les temps</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">12</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Contrats acceptés</div>
                    <div className="text-sm text-gray-500">Cette année</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">8</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">Heures travaillées</div>
                    <div className="text-sm text-gray-500">Ce mois</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">156h</div>
              </div>
            </div>
          </div>

          {/* Informations du compte */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-600" />
              Informations du compte
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Email</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Membre depuis</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: fr })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Rôle</div>
                  <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Téléphone</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 