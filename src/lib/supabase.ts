import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement avec gestion d'erreur plus robuste
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes:', {
    url: supabaseUrl ? 'définie' : 'manquante',
    key: supabaseAnonKey ? 'définie' : 'manquante'
  });
  
  // En production, on peut continuer avec des valeurs par défaut ou afficher un message d'erreur
  if (import.meta.env.PROD) {
    console.error('Configuration Supabase manquante en production');
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types pour les tables Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'technician';
          phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role: 'admin' | 'technician';
          phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: 'admin' | 'technician';
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: 'sound' | 'lighting' | 'video' | 'stage';
          level: 'beginner' | 'intermediate' | 'expert';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'sound' | 'lighting' | 'video' | 'stage';
          level: 'beginner' | 'intermediate' | 'expert';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'sound' | 'lighting' | 'video' | 'stage';
          level?: 'beginner' | 'intermediate' | 'expert';
          created_at?: string;
        };
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          created_at?: string;
        };
      };
      event_types: {
        Row: {
          id: string;
          name: string;
          color: string;
          default_duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          default_duration: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          default_duration?: number;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          location: string;
          type_id: string;
          status: 'draft' | 'published' | 'confirmed' | 'completed' | 'cancelled';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          location: string;
          type_id: string;
          status: 'draft' | 'published' | 'confirmed' | 'completed' | 'cancelled';
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          location?: string;
          type_id?: string;
          status?: 'draft' | 'published' | 'confirmed' | 'completed' | 'cancelled';
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_requirements: {
        Row: {
          id: string;
          event_id: string;
          skill_id: string;
          count: number;
          level: 'beginner' | 'intermediate' | 'expert';
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          skill_id: string;
          count: number;
          level: 'beginner' | 'intermediate' | 'expert';
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          skill_id?: string;
          count?: number;
          level?: 'beginner' | 'intermediate' | 'expert';
          created_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          event_id: string;
          technician_id: string;
          status: 'pending' | 'accepted' | 'declined';
          response_date: string | null;
          decline_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          technician_id: string;
          status: 'pending' | 'accepted' | 'declined';
          response_date?: string | null;
          decline_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          technician_id?: string;
          status?: 'pending' | 'accepted' | 'declined';
          response_date?: string | null;
          decline_reason?: string | null;
          created_at?: string;
        };
      };
    };
  };
} 