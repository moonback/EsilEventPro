import { Skill, EventType } from '../types';

// Compétences par défaut
export const defaultSkills: Skill[] = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Mixage Audio', category: 'sound', level: 'expert' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Installation Sono', category: 'sound', level: 'intermediate' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Éclairage Scène', category: 'lighting', level: 'expert' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Projecteurs LED', category: 'lighting', level: 'intermediate' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Régie Vidéo', category: 'video', level: 'expert' },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Captation Multi-Cam', category: 'video', level: 'expert' },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Montage Vidéo', category: 'video', level: 'intermediate' },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Installation Scène', category: 'stage', level: 'expert' },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Décors', category: 'stage', level: 'intermediate' },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Sécurité', category: 'stage', level: 'beginner' },
];

// Types d'événements par défaut
export const defaultEventTypes: EventType[] = [
  { id: '660e8400-e29b-41d4-a716-446655440001', name: 'Concert', color: '#3B82F6', defaultDuration: 6 },
  { id: '660e8400-e29b-41d4-a716-446655440002', name: 'Conférence', color: '#10B981', defaultDuration: 8 },
  { id: '660e8400-e29b-41d4-a716-446655440003', name: 'Mariage', color: '#F59E0B', defaultDuration: 12 },
  { id: '660e8400-e29b-41d4-a716-446655440004', name: 'Festival', color: '#EF4444', defaultDuration: 24 },
  { id: '660e8400-e29b-41d4-a716-446655440005', name: 'Spectacle', color: '#8B5CF6', defaultDuration: 4 },
  { id: '660e8400-e29b-41d4-a716-446655440006', name: 'Exposition', color: '#06B6D4', defaultDuration: 8 },
  { id: '660e8400-e29b-41d4-a716-446655440007', name: 'Séminaire', color: '#84CC16', defaultDuration: 6 },
  { id: '660e8400-e29b-41d4-a716-446655440008', name: 'Soirée Privée', color: '#F97316', defaultDuration: 4 },
];

// Configuration des catégories de compétences
export const skillCategories = [
  { value: 'sound', label: 'Son', color: '#3B82F6' },
  { value: 'lighting', label: 'Éclairage', color: '#F59E0B' },
  { value: 'video', label: 'Vidéo', color: '#EF4444' },
  { value: 'stage', label: 'Scène', color: '#8B5CF6' },
  
] as const;

// Configuration des niveaux de compétences
export const skillLevels = [
  { value: 'beginner', label: 'Débutant', color: '#10B981' },
  { value: 'intermediate', label: 'Intermédiaire', color: '#F59E0B' },
  { value: 'expert', label: 'Expert', color: '#EF4444' },
] as const;

// Configuration des statuts d'événements
export const eventStatuses = [
  { value: 'draft', label: 'Brouillon', color: '#6B7280' },
  { value: 'published', label: 'Publié', color: '#3B82F6' },
  { value: 'confirmed', label: 'Confirmé', color: '#10B981' },
  { value: 'completed', label: 'Terminé', color: '#059669' },
  { value: 'cancelled', label: 'Annulé', color: '#EF4444' },
] as const;

// Configuration des statuts d'affectation
export const assignmentStatuses = [
  { value: 'pending', label: 'En attente', color: '#F59E0B' },
  { value: 'accepted', label: 'Accepté', color: '#10B981' },
  { value: 'declined', label: 'Refusé', color: '#EF4444' },
] as const; 