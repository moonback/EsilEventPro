import { supabase } from '../lib/supabase';
import { User, LoginCredentials } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Utilisateur non trouvé');

    // Récupérer les données utilisateur depuis notre table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_skills (
          skill_id,
          skills (*)
        )
      `)
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('Profil utilisateur non trouvé');

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      phone: userData.phone,
      skills: userData.user_skills?.map((us: any) => us.skills) || [],
      createdAt: new Date(userData.created_at),
      updatedAt: new Date(userData.updated_at),
    };
  },

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Erreur lors de la création du compte');

    // Créer le profil utilisateur dans notre table users
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        phone: userData.phone,
      })
      .select()
      .single();

    if (profileError) throw profileError;

    // Ajouter les compétences si fournies
    if (userData.skills.length > 0) {
      const skillInserts = userData.skills.map(skill => ({
        user_id: authData.user.id,
        skill_id: skill.id,
      }));

      await supabase.from('user_skills').insert(skillInserts);
    }

    return {
      id: profileData.id,
      email: profileData.email,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      role: profileData.role,
      phone: profileData.phone,
      skills: userData.skills,
      createdAt: new Date(profileData.created_at),
      updatedAt: new Date(profileData.updated_at),
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;

    // Récupérer les données utilisateur depuis notre table users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_skills (
          skill_id,
          skills (*)
        )
      `)
      .eq('id', user.id)
      .single();

    if (userError || !userData) return null;

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      phone: userData.phone,
      skills: userData.user_skills?.map((us: any) => us.skills) || [],
      createdAt: new Date(userData.created_at),
      updatedAt: new Date(userData.updated_at),
    };
  },

  async refreshSession(): Promise<void> {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
  },

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const user = await this.getCurrentUser();
          callback(user);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          callback(null);
        }
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  },
}; 