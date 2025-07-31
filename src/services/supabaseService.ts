import { supabase } from '../lib/supabase';
import { User, Event, Assignment, Skill, EventType, EventFormData, MissionPricing, TargetedTechnician } from '../types';
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

    // Récupérer toutes les données de tarification en une seule requête
    const { data: pricingData, error: pricingError } = await supabase
      .from('mission_pricing')
      .select('*');

    if (pricingError) {
      console.error('Erreur lors de la récupération des tarifications:', pricingError);
    }

    // Récupérer toutes les sélections de techniciens en une seule requête
    const { data: targetedData, error: targetedError } = await supabase
      .from('targeted_technicians')
      .select('*');

    if (targetedError) {
      console.error('Erreur lors de la récupération des techniciens ciblés:', targetedError);
    }

    // Organiser les données par événement
    const pricingByEvent = new Map();
    pricingData?.forEach((pricing: any) => {
      pricingByEvent.set(pricing.event_id, {
        id: pricing.id,
        eventId: pricing.event_id,
        basePrice: pricing.base_price,
        pricePerHour: pricing.price_per_hour,
        bonusPercentage: pricing.bonus_percentage,
        createdAt: new Date(pricing.created_at),
        updatedAt: new Date(pricing.updated_at),
      });
    });

    const targetedByEvent = new Map();
    targetedData?.forEach((targeted: any) => {
      if (!targetedByEvent.has(targeted.event_id)) {
        targetedByEvent.set(targeted.event_id, []);
      }
      targetedByEvent.get(targeted.event_id).push({
        id: targeted.id,
        eventId: targeted.event_id,
        technicianId: targeted.technician_id,
        selectedByAdmin: targeted.selected_by_admin,
        selectionReason: targeted.selection_reason,
        createdAt: new Date(targeted.created_at),
      });
    });

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
      pricing: pricingByEvent.get(event.id),
      targetedTechnicians: targetedByEvent.get(event.id) || [],
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

    // Récupérer les données de tarification
    let pricing: MissionPricing | undefined = undefined;
    try {
      pricing = await missionPricingService.getByEventId(id) || undefined;
    } catch (error) {
      console.error('Erreur lors de la récupération de la tarification:', error);
    }

    // Récupérer les techniciens ciblés
    let targetedTechnicians: TargetedTechnician[] = [];
    try {
      targetedTechnicians = await targetedTechniciansService.getByEventId(id);
    } catch (error) {
      console.error('Erreur lors de la récupération des techniciens ciblés:', error);
    }

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
      pricing,
      targetedTechnicians,
    };
  },

  async create(eventData: EventFormData & { createdBy: string }): Promise<Event> {
    // S'assurer que les dates sont des objets Date
    const startDate = eventData.startDate instanceof Date ? eventData.startDate : new Date(eventData.startDate);
    const endDate = eventData.endDate instanceof Date ? eventData.endDate : new Date(eventData.endDate);
    
    // Créer l'événement
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
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

    // Créer le forfait de rémunération si fourni
    if (eventData.pricing) {
      await missionPricingService.create({
        eventId: event.id,
        basePrice: eventData.pricing.basePrice,
        pricePerHour: eventData.pricing.pricePerHour,
        bonusPercentage: eventData.pricing.bonusPercentage,
      });
    }

    // Créer les sélections ciblées de techniciens si fournies
    if (eventData.targetedTechnicians && eventData.targetedTechnicians.length > 0) {
      const selectionInserts = eventData.targetedTechnicians.map(technicianId => ({
        eventId: event.id,
        technicianId,
        selectedByAdmin: true,
        selectionReason: '',
      }));

      await targetedTechniciansService.createMultiple(selectionInserts);
    }

    // Récupérer l'événement complet avec les relations
    return this.getById(event.id) as Promise<Event>;
  },

  async update(id: string, eventData: Partial<EventFormData>): Promise<Event> {
    const updateData: any = {};
    if (eventData.title) updateData.title = eventData.title;
    if (eventData.description) updateData.description = eventData.description;
    if (eventData.startDate) {
      const startDate = eventData.startDate instanceof Date ? eventData.startDate : new Date(eventData.startDate);
      updateData.start_date = startDate.toISOString();
    }
    if (eventData.endDate) {
      const endDate = eventData.endDate instanceof Date ? eventData.endDate : new Date(eventData.endDate);
      updateData.end_date = endDate.toISOString();
    }
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

    // Mettre à jour le forfait de rémunération si fourni
    if (eventData.pricing) {
      try {
        // Vérifier si un forfait existe déjà pour cet événement
        const existingPricing = await missionPricingService.getByEventId(id);
        if (existingPricing) {
          // Mettre à jour le forfait existant
          await missionPricingService.update(id, {
            basePrice: eventData.pricing.basePrice,
            pricePerHour: eventData.pricing.pricePerHour,
            bonusPercentage: eventData.pricing.bonusPercentage,
          });
        } else {
          // Créer un nouveau forfait
          await missionPricingService.create({
            eventId: id,
            basePrice: eventData.pricing.basePrice,
            pricePerHour: eventData.pricing.pricePerHour,
            bonusPercentage: eventData.pricing.bonusPercentage,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du forfait de rémunération:', error);
        // Ne pas faire échouer la mise à jour de l'événement pour un problème de tarification
      }
    }

    // Mettre à jour les sélections ciblées de techniciens si fournies
    if (eventData.targetedTechnicians !== undefined) {
      // Supprimer les anciennes sélections
      await targetedTechniciansService.deleteByEventId(id);
      
      // Ajouter les nouvelles sélections
      if (eventData.targetedTechnicians.length > 0) {
        const selectionInserts = eventData.targetedTechnicians.map(technicianId => ({
          eventId: id,
          technicianId,
          selectedByAdmin: true,
          selectionReason: '',
        }));
        await targetedTechniciansService.createMultiple(selectionInserts);
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
      if (assignment.status === 'accepted' && assignment.events && Array.isArray(assignment.events) && assignment.events.length > 0) {
        const event = assignment.events[0]; // Prendre le premier événement
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

// Service pour les forfaits de rémunération
export const missionPricingService = {
  async getByEventId(eventId: string): Promise<MissionPricing | null> {
    console.log('Tentative de récupération du pricing pour event:', eventId);
    
    try {
      // Première tentative : récupération directe
      const { data, error } = await supabase
        .from('mission_pricing')
        .select('*')
        .eq('event_id', eventId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erreur lors de la récupération directe du pricing:', error);
        
        // Si l'erreur est 406, essayer une approche alternative
        if (error.code === '406' || error.message?.includes('406')) {
          console.log('Erreur 406 détectée, tentative d\'approche alternative');
          
          // Essayer de récupérer via une jointure avec assignments
          const { data: assignmentData, error: assignmentError } = await supabase
            .from('assignments')
            .select(`
              event_id,
              mission_pricing!inner(*)
            `)
            .eq('event_id', eventId)
            .order('mission_pricing.updated_at', { ascending: false })
            .limit(1);

          if (assignmentError) {
            console.error('Erreur lors de la récupération via assignments:', assignmentError);
            throw error; // Retourner l'erreur originale
          }

          if (!assignmentData || !Array.isArray(assignmentData) || assignmentData.length === 0) {
            console.log('Aucune donnée de pricing trouvée via assignments');
            return null;
          }

          const assignment = assignmentData[0];
          if (!assignment?.mission_pricing || !Array.isArray(assignment.mission_pricing) || assignment.mission_pricing.length === 0) {
            console.log('Aucune donnée de pricing trouvée dans l\'assignment');
            return null;
          }

          const pricingData = assignment.mission_pricing[0];
          console.log('Pricing récupéré avec succès (via assignments):', pricingData);
          return {
            id: pricingData.id,
            eventId: pricingData.event_id,
            basePrice: pricingData.base_price,
            pricePerHour: pricingData.price_per_hour,
            bonusPercentage: pricingData.bonus_percentage,
            createdAt: new Date(pricingData.created_at),
            updatedAt: new Date(pricingData.updated_at),
          };
        }
        
        throw error;
      }
      
      // Vérifier si on a des données
      if (!data || data.length === 0) {
        console.log('Aucune donnée de pricing trouvée pour cet événement');
        return null;
      }

      const pricingData = data[0];
      console.log('Pricing récupéré avec succès:', pricingData);
      return {
        id: pricingData.id,
        eventId: pricingData.event_id,
        basePrice: pricingData.base_price,
        pricePerHour: pricingData.price_per_hour,
        bonusPercentage: pricingData.bonus_percentage,
        createdAt: new Date(pricingData.created_at),
        updatedAt: new Date(pricingData.updated_at),
      };
    } catch (error) {
      console.error('Erreur fatale lors de la récupération du pricing:', error);
      throw error;
    }
  },

  async create(pricingData: Omit<MissionPricing, 'id' | 'createdAt' | 'updatedAt'>): Promise<MissionPricing> {
    const { data, error } = await supabase
      .from('mission_pricing')
      .insert({
        event_id: pricingData.eventId,
        base_price: pricingData.basePrice,
        price_per_hour: pricingData.pricePerHour,
        bonus_percentage: pricingData.bonusPercentage,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      eventId: data.event_id,
      basePrice: data.base_price,
      pricePerHour: data.price_per_hour,
      bonusPercentage: data.bonus_percentage,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async update(eventId: string, pricingData: Partial<Omit<MissionPricing, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>>): Promise<MissionPricing> {
    const { data, error } = await supabase
      .from('mission_pricing')
      .update({
        base_price: pricingData.basePrice,
        price_per_hour: pricingData.pricePerHour,
        bonus_percentage: pricingData.bonusPercentage,
      })
      .eq('event_id', eventId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      eventId: data.event_id,
      basePrice: data.base_price,
      pricePerHour: data.price_per_hour,
      bonusPercentage: data.bonus_percentage,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async calculateMissionPrice(eventId: string, technicianId: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('calculate_mission_price', {
        p_event_id: eventId,
        p_technician_id: technicianId,
      });

    if (error) throw error;
    return data || 0;
  },
};

// Service pour la sélection ciblée des techniciens
export const targetedTechniciansService = {
  async getByEventId(eventId: string): Promise<TargetedTechnician[]> {
    const { data, error } = await supabase
      .from('targeted_technicians')
      .select('*')
      .eq('event_id', eventId);

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      eventId: item.event_id,
      technicianId: item.technician_id,
      selectedByAdmin: item.selected_by_admin,
      selectionReason: item.selection_reason,
      createdAt: new Date(item.created_at),
    })) || [];
  },

  async create(selectionData: Omit<TargetedTechnician, 'id' | 'createdAt'>): Promise<TargetedTechnician> {
    const { data, error } = await supabase
      .from('targeted_technicians')
      .insert({
        event_id: selectionData.eventId,
        technician_id: selectionData.technicianId,
        selected_by_admin: selectionData.selectedByAdmin,
        selection_reason: selectionData.selectionReason,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      eventId: data.event_id,
      technicianId: data.technician_id,
      selectedByAdmin: data.selected_by_admin,
      selectionReason: data.selection_reason,
      createdAt: new Date(data.created_at),
    };
  },

  async createMultiple(selections: Omit<TargetedTechnician, 'id' | 'createdAt'>[]): Promise<TargetedTechnician[]> {
    const { data, error } = await supabase
      .from('targeted_technicians')
      .insert(
        selections.map(selection => ({
          event_id: selection.eventId,
          technician_id: selection.technicianId,
          selected_by_admin: selection.selectedByAdmin,
          selection_reason: selection.selectionReason,
        }))
      )
      .select();

    if (error) throw error;

    return data?.map(item => ({
      id: item.id,
      eventId: item.event_id,
      technicianId: item.technician_id,
      selectedByAdmin: item.selected_by_admin,
      selectionReason: item.selection_reason,
      createdAt: new Date(item.created_at),
    })) || [];
  },

  async deleteByEventId(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('targeted_technicians')
      .delete()
      .eq('event_id', eventId);

    if (error) throw error;
  },

  async getTechniciansWithAvailability(eventId: string): Promise<Array<User & { availability: string; estimatedPrice: number }>> {
    // Récupérer les techniciens avec leurs compétences
    const technicians = await userService.getAll();
    const techniciansWithSkills = technicians.filter(user => user.role === 'technician');

    // Récupérer les exigences de l'événement
    const event = await eventService.getById(eventId);
    if (!event) return [];

    // Récupérer le forfait de rémunération
    const pricing = await missionPricingService.getByEventId(eventId);

    return techniciansWithSkills.map(technician => {
      // Vérifier si le technicien a les compétences requises
      const hasRequiredSkills = event.requiredTechnicians.some(req =>
        technician.skills.some(skill => skill.id === req.skillId)
      );

      // Simuler la disponibilité (dans un vrai projet, cela viendrait d'une API)
      const availability = hasRequiredSkills ? 'available' : 'unknown';

      // Calculer le prix estimé
      const durationHours = differenceInHours(event.endDate, event.startDate);
      const estimatedPrice = pricing 
        ? pricing.basePrice + (pricing.pricePerHour * durationHours)
        : 50 + (25 * durationHours);

      return {
        ...technician,
        availability,
        estimatedPrice,
      };
    });
  },
}; 