import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Skill } from '../types';
import { Plus, Edit, Trash2, BookOpen, Zap, Video, Lightbulb, Music } from 'lucide-react';

interface SkillsManagementProps {
  onNavigate: (page: string) => void;
}

const SkillsManagement: React.FC<SkillsManagementProps> = ({ onNavigate }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'sound' | 'lighting' | 'video' | 'stage'>('all');
  const [filterLevel, setFilterLevel] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');

  // États pour le formulaire
  const [formData, setFormData] = useState({
    name: '',
    category: 'sound' as 'sound' | 'lighting' | 'video' | 'stage',
    level: 'beginner' as 'beginner' | 'intermediate' | 'expert'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          name: formData.name,
          category: formData.category,
          level: formData.level
        });

      if (error) throw error;

      setShowAddModal(false);
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la compétence:', error);
    }
  };

  const handleEditSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkill) return;

    try {
      const { error } = await supabase
        .from('skills')
        .update({
          name: formData.name,
          category: formData.category,
          level: formData.level
        })
        .eq('id', selectedSkill.id);

      if (error) throw error;

      setShowEditModal(false);
      setSelectedSkill(null);
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Erreur lors de la modification de la compétence:', error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) return;

    try {
      // Vérifier si la compétence est utilisée
      const { data: userSkills, error: userSkillsError } = await supabase
        .from('user_skills')
        .select('*')
        .eq('skill_id', skillId);

      if (userSkillsError) throw userSkillsError;

      if (userSkills && userSkills.length > 0) {
        alert('Cette compétence est utilisée par des utilisateurs et ne peut pas être supprimée.');
        return;
      }

      // Vérifier si la compétence est utilisée dans les exigences d'événements
      const { data: eventRequirements, error: eventRequirementsError } = await supabase
        .from('event_requirements')
        .select('*')
        .eq('skill_id', skillId);

      if (eventRequirementsError) throw eventRequirementsError;

      if (eventRequirements && eventRequirements.length > 0) {
        alert('Cette compétence est utilisée dans des exigences d\'événements et ne peut pas être supprimée.');
        return;
      }

      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      fetchSkills();
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétence:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'sound',
      level: 'beginner'
    });
  };

  const openEditModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level
    });
    setShowEditModal(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sound':
        return <Music className="h-4 w-4" />;
      case 'lighting':
        return <Lightbulb className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'stage':
        return <Zap className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sound':
        return 'bg-blue-100 text-blue-800';
      case 'lighting':
        return 'bg-yellow-100 text-yellow-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'stage':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || skill.level === filterLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Compétences</h1>
          <p className="text-gray-600">Gérez les compétences techniques disponibles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Ajouter une compétence
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Rechercher une compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="sound">Audio</option>
            <option value="lighting">Éclairage</option>
            <option value="video">Vidéo</option>
            <option value="stage">Scène</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Audio</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.filter(s => s.category === 'sound').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Éclairage</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.filter(s => s.category === 'lighting').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vidéo</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.filter(s => s.category === 'video').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scène</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.filter(s => s.category === 'stage').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des compétences */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compétence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getCategoryIcon(skill.category)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {skill.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {skill.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                      {getCategoryIcon(skill.category)}
                      <span className="ml-1">
                        {skill.category === 'sound' && 'Audio'}
                        {skill.category === 'lighting' && 'Éclairage'}
                        {skill.category === 'video' && 'Vidéo'}
                        {skill.category === 'stage' && 'Scène'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level === 'beginner' && 'Débutant'}
                      {skill.level === 'intermediate' && 'Intermédiaire'}
                      {skill.level === 'expert' && 'Expert'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter une compétence</h2>
            <form onSubmit={handleAddSkill}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de la compétence</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sound">Audio</option>
                    <option value="lighting">Éclairage</option>
                    <option value="video">Vidéo</option>
                    <option value="stage">Scène</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && selectedSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Modifier la compétence</h2>
            <form onSubmit={handleEditSkill}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de la compétence</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sound">Audio</option>
                    <option value="lighting">Éclairage</option>
                    <option value="video">Vidéo</option>
                    <option value="stage">Scène</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManagement; 