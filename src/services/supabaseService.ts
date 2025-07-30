import { supabase } from '../lib/supabase';
import { User, Event, Assignment, Skill, EventType, EventFormData } from '../types';
import { Database } from '../lib/supabase';
import { differenceInHours } from 'date-fns';

type Tables = Database['public']['Tables'];

// Service pour les utilisateurs
export const userService = {
  async getAll(): Promise<User[]> {
    // Récupérer les utilisateurs et leurs compétences séparément pour éviter les problèmes de RLS
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) throw usersError;

    const { data: userSkillsData, error: userSkillsError } = await supabase
      .from('user_skills')
      .select(`
        user_id,
        skills (*)
      `);

    if (userSkillsError) throw userSkillsError;

    // Organiser les compétences par utilisateur
    const skillsByUser: { [key: string]: any[] } = {};
    userSkillsData?.forEach((item: any) => {
      if (!skillsByUser[item.user_id]) {
        skillsByUser[item.user_id] = [];
      }
      if (item.skills) {
        skillsByUser[item.user_id].push(item.skills);
      }
    });

    return usersData?.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      phone: user.phone,
      hourlyRate: user.hourly_rate || 0,
      skills: skillsByUser[user.id] || [],
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at),
    })) || [];
  },

  async getById(id: string): Promise<User | null> {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userError) throw userError;
    if (!userData) return null;

    // Récupérer les compétences de l'utilisateur
    const { data: userSkillsData, error: userSkillsError } = await supabase
      .from('user_skills')
      .select(`
        skills (*)
      `)
      .eq('user_id', id);

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

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        hourly_rate: userData.hourlyRate || 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Ajouter les compétences si fournies
    if (userData.skills.length > 0) {
      const skillInserts = userData.skills.map(skill => ({
        user_id: data.id,
        skill_id: skill.id,
      }));

      await supabase.from('user_skills').insert(skillInserts);
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      phone: data.phone,
      hourlyRate: data.hourly_rate || 0,
      skills: userData.skills,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updateData: any = {};
    if (userData.email) updateData.email = userData.email;
    if (userData.firstName) updateData.first_name = userData.firstName;
    if (userData.lastName) updateData.last_name = userData.lastName;
    if (userData.role) updateData.role = userData.role;
    if (userData.phone) updateData.phone = userData.phone;
    if (userData.hourlyRate !== undefined) updateData.hourly_rate = userData.hourlyRate;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour les compétences si fournies
    if (userData.skills !== undefined) {
      // Supprimer les anciennes compétences
      await supabase.from('user_skills').delete().eq('user_id', id);
      
      // Ajouter les nouvelles compétences
      if (userData.skills.length > 0) {
        const skillInserts = userData.skills.map(skill => ({
          user_id: id,
          skill_id: skill.id,
        }));
        await supabase.from('user_skills').insert(skillInserts);
      }
    }

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      phone: data.phone,
      hourlyRate: data.hourly_rate || 0,
      skills: userData.skills || [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },
};

// Service pour les compétences
export const skillService = {
  async getAll(): Promise<Skill[]> {
    const { data, error } = await supabase.from('skills').select('*');
    if (error) throw error;

    return data?.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
    })) || [];
  },

  async create(skillData: Omit<Skill, 'id'>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert({
        name: skillData.name,
        category: skillData.category,
        level: skillData.level,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      category: data.category,
      level: data.level,
    };
  },
};

// Service pour les types d'événements
export const eventTypeService = {
  async getAll(): Promise<EventType[]> {
    const { data, error } = await supabase.from('event_types').select('*');
    if (error) throw error;

    return data?.map(type => ({
      id: type.id,
      name: type.name,
      color: type.color,
      defaultDuration: type.default_duration,
    })) || [];
  },

  async create(typeData: Omit<EventType, 'id'>): Promise<EventType> {
    const { data, error } = await supabase
      .from('event_types')
      .insert({
        name: typeData.name,
        color: typeData.color,
        default_duration: typeData.defaultDuration,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      color: data.color,
      defaultDuration: data.default_duration,
    };
  },
};

// Service pour les événements
export const eventService = {
  async getAll(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_types (*),
        event_requirements (*)
      `);

    if (error) throw error;

    return data?.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: new Date(event.start_date),
      endDate: new Date(event.end_date),
      location: event.location,
      type: {
        id: event.event_types.id,
        name: event.event_types.name,
        color: event.event_types.color,
        defaultDuration: event.event_types.default_duration,
      },
      requiredTechnicians: event.event_requirements?.map((req: any) => ({
        skillId: req.skill_id,
        count: req.count,
        level: req.level,
      })) || [],
      assignments: [], // Sera chargé séparément
      status: event.status,
      createdBy: event.created_by,
      createdAt: new Date(event.created_at),
      updatedAt: new Date(event.updated_at),
    })) || [];
  },

  async getById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_types (*),
        event_requirements (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      location: data.location,
      type: {
        id: data.event_types.id,
        name: data.event_types.name,
        color: data.event_types.color,
        defaultDuration: data.event_types.default_duration,
      },
      requiredTechnicians: data.event_requirements?.map((req: any) => ({
        skillId: req.skill_id,
        count: req.count,
        level: req.level,
      })) || [],
      assignments: [],
      status: data.status,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async create(eventData: EventFormData & { createdBy: string }): Promise<Event> {
    // Créer l'événement
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.startDate.toISOString(),
        end_date: eventData.endDate.toISOString(),
        location: eventData.location,
        type_id: eventData.typeId,
        status: 'draft',
        created_by: eventData.createdBy,
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // Ajouter les exigences en techniciens
    if (eventData.requiredTechnicians.length > 0) {
      const requirementInserts = eventData.requiredTechnicians.map(req => ({
        event_id: event.id,
        skill_id: req.skillId,
        count: req.count,
        level: req.level,
      }));

      await supabase.from('event_requirements').insert(requirementInserts);
    }

    // Récupérer l'événement complet avec les relations
    return this.getById(event.id) as Promise<Event>;
  },

  async update(id: string, eventData: Partial<EventFormData>): Promise<Event> {
    const updateData: any = {};
    if (eventData.title) updateData.title = eventData.title;
    if (eventData.description) updateData.description = eventData.description;
    if (eventData.startDate) updateData.start_date = eventData.startDate.toISOString();
    if (eventData.endDate) updateData.end_date = eventData.endDate.toISOString();
    if (eventData.location) updateData.location = eventData.location;
    if (eventData.typeId) updateData.type_id = eventData.typeId;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    // Mettre à jour les exigences si fournies
    if (eventData.requiredTechnicians !== undefined) {
      // Supprimer les anciennes exigences
      await supabase.from('event_requirements').delete().eq('event_id', id);
      
      // Ajouter les nouvelles exigences
      if (eventData.requiredTechnicians.length > 0) {
        const requirementInserts = eventData.requiredTechnicians.map(req => ({
          event_id: id,
          skill_id: req.skillId,
          count: req.count,
          level: req.level,
        }));
        await supabase.from('event_requirements').insert(requirementInserts);
      }
    }

    return this.getById(id) as Promise<Event>;
  },

  async updateStatus(id: string, status: 'draft' | 'published' | 'confirmed' | 'completed' | 'cancelled'): Promise<Event> {
    console.log('Service: Mise à jour du statut', { id, status });
    
    const { error } = await supabase
      .from('events')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    console.log('Service: Statut mis à jour avec succès');
    return this.getById(id) as Promise<Event>;
  },

  async delete(id: string): Promise<void> {
    // Supprimer les exigences d'abord
    await supabase.from('event_requirements').delete().eq('event_id', id);
    
    // Supprimer les affectations
    await supabase.from('assignments').delete().eq('event_id', id);
    
    // Supprimer l'événement
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },
};

// Service pour les affectations
export const assignmentService = {
  async getAll(): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        events (*),
        users (*)
      `);

    if (error) throw error;

    return data?.map(assignment => ({
      id: assignment.id,
      eventId: assignment.event_id,
      technicianId: assignment.technician_id,
      status: assignment.status,
      responseDate: assignment.response_date ? new Date(assignment.response_date) : undefined,
      declineReason: assignment.decline_reason,
      createdAt: new Date(assignment.created_at),
    })) || [];
  },

  async getByTechnician(technicianId: string): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        events (*)
      `)
      .eq('technician_id', technicianId);

    if (error) throw error;

    return data?.map(assignment => ({
      id: assignment.id,
      eventId: assignment.event_id,
      technicianId: assignment.technician_id,
      status: assignment.status,
      responseDate: assignment.response_date ? new Date(assignment.response_date) : undefined,
      declineReason: assignment.decline_reason,
      createdAt: new Date(assignment.created_at),
    })) || [];
  },

  async create(assignmentData: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        event_id: assignmentData.eventId,
        technician_id: assignmentData.technicianId,
        status: assignmentData.status,
        response_date: assignmentData.responseDate?.toISOString() || null,
        decline_reason: assignmentData.declineReason || null,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      eventId: data.event_id,
      technicianId: data.technician_id,
      status: data.status,
      responseDate: data.response_date ? new Date(data.response_date) : undefined,
      declineReason: data.decline_reason,
      createdAt: new Date(data.created_at),
    };
  },

  async update(id: string, assignmentData: Partial<Assignment>): Promise<Assignment> {
    const updateData: any = {};
    if (assignmentData.status) updateData.status = assignmentData.status;
    if (assignmentData.responseDate) updateData.response_date = assignmentData.responseDate.toISOString();
    if (assignmentData.declineReason !== undefined) updateData.decline_reason = assignmentData.declineReason;

    const { data, error } = await supabase
      .from('assignments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      eventId: data.event_id,
      technicianId: data.technician_id,
      status: data.status,
      responseDate: data.response_date ? new Date(data.response_date) : undefined,
      declineReason: data.decline_reason,
      createdAt: new Date(data.created_at),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) throw error;
  },
};

// Service pour les compétences utilisateur
export const userSkillsService = {
  async getUserSkills(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', userId);

    if (error) throw error;

    return data?.map(item => item.skill_id) || [];
  },

  async updateUserSkills(userId: string, skillIds: string[]): Promise<void> {
    // Supprimer toutes les compétences actuelles
    const { error: deleteError } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // Ajouter les nouvelles compétences
    if (skillIds.length > 0) {
      const userSkillsData = skillIds.map(skillId => ({
        user_id: userId,
        skill_id: skillId,
      }));

      const { error: insertError } = await supabase
        .from('user_skills')
        .insert(userSkillsData);

      if (insertError) throw insertError;
    }
  },
};

// Service pour les statistiques utilisateur
export const userStatsService = {
  async getUserStats(userId: string): Promise<{
    totalAssignments: number;
    acceptedAssignments: number;
    declinedAssignments: number;
    pendingAssignments: number;
    hoursWorked: number;
    hoursThisMonth: number;
    hoursThisYear: number;
  }> {
    // Requête optimisée pour récupérer toutes les statistiques en une fois
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        id,
        status,
        events (
          id,
          start_date,
          end_date
        )
      `)
      .eq('technician_id', userId);

    if (error) throw error;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);

    let totalAssignments = 0;
    let acceptedAssignments = 0;
    let declinedAssignments = 0;
    let pendingAssignments = 0;
    let hoursWorked = 0;
    let hoursThisMonth = 0;
    let hoursThisYear = 0;

    data?.forEach(assignment => {
      totalAssignments++;
      
      switch (assignment.status) {
        case 'accepted':
          acceptedAssignments++;
          break;
        case 'declined':
          declinedAssignments++;
          break;
        case 'pending':
          pendingAssignments++;
          break;
      }

      // Calculer les heures si l'affectation est acceptée
      if (assignment.status === 'accepted' && assignment.events) {
        const event = assignment.events;
        const eventStart = new Date(event.start_date);
        const eventEnd = new Date(event.end_date);
        
        const duration = differenceInHours(eventEnd, eventStart);
        hoursWorked += duration;
        
        // Heures ce mois
        if (eventStart <= monthEnd && eventEnd >= monthStart) {
          hoursThisMonth += duration;
        }
        
        // Heures cette année
        if (eventStart <= yearEnd && eventEnd >= yearStart) {
          hoursThisYear += duration;
        }
      }
    });

    return {
      totalAssignments,
      acceptedAssignments,
      declinedAssignments,
      pendingAssignments,
      hoursWorked,
      hoursThisMonth,
      hoursThisYear
    };
  },

  async getUserAssignmentsWithEvents(userId: string): Promise<Array<{
    assignment: any;
    event: any;
  }>> {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        events (*)
      `)
      .eq('technician_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      assignment: item,
      event: item.events
    })) || [];
  }
}; 