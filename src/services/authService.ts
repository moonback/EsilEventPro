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
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error('Profil utilisateur non trouvé');

    // Récupérer les compétences de l'utilisateur
    const { data: userSkillsData, error: userSkillsError } = await supabase
      .from('user_skills')
      .select(`
        skills (*)
      `)
      .eq('user_id', data.user.id);

    if (userSkillsError) throw userSkillsError;

    const skills = userSkillsData?.map((item: any) => item.skills).filter(Boolean) || [];

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role,
      phone: userData.phone,
      hourlyRate: userData.hourly_rate || 0,
      skills: skills,
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

    try {
      // Utiliser la fonction SQL pour créer l'utilisateur avec ses compétences
      const skillIds = userData.skills.map(skill => skill.id);
      
                const { data: result, error: functionError } = await supabase.rpc('create_user_with_skills', {
            p_user_id: authData.user.id,
            p_user_email: userData.email,
            p_user_first_name: userData.firstName,
            p_user_last_name: userData.lastName,
            p_user_role: userData.role,
            p_user_phone: userData.phone,
            p_skill_ids: skillIds
          });

      if (functionError) {
        console.error('Erreur lors de la création du profil:', functionError);
        
        // Gérer les erreurs spécifiques
        if (functionError.message && functionError.message.includes('violates foreign key constraint')) {
          throw new Error('Certaines compétences sélectionnées ne sont pas disponibles. Veuillez réessayer.');
        }
        
        throw new Error('Erreur lors de la création du profil utilisateur');
      }

      return {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
        phone: result.phone,
        skills: userData.skills,
        createdAt: new Date(result.createdAt),
        updatedAt: new Date(result.updatedAt),
      };
    } catch (error) {
      // Si l'insertion dans la table users échoue, supprimer l'utilisateur Auth
      console.error('Erreur lors de l\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
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