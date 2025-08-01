import { create } from 'zustand';
import { AppState, Event, User, Assignment, Skill, EventType, EventFormData } from '../types';
import { userService, eventService, assignmentService, skillService, eventTypeService } from '../services/supabaseService';
import { defaultSkills, defaultEventTypes } from '../config/defaultData';

interface AppStore extends AppState {
  // Users
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Events
  addEvent: (event: EventFormData & { createdBy: string }) => Promise<void>;
  updateEvent: (id: string, event: Partial<EventFormData>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEventStatus: (id: string, status: 'draft' | 'published' | 'confirmed' | 'completed' | 'cancelled') => Promise<void>;
  
  // Assignments
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  
  // Data loading
  loadInitialData: () => Promise<void>;
  isLoading: boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  users: [],
  events: [],
  assignments: [],
  skills: [],
  eventTypes: [],
  isLoading: false,

  addUser: async (userData) => {
    try {
      const newUser = await userService.create(userData);
      set(state => ({ users: [...state.users, newUser] }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const updatedUser = await userService.update(id, userData);
      set(state => ({
        users: state.users.map(user =>
          user.id === id ? updatedUser : user
        )
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await userService.delete(id);
      set(state => ({ users: state.users.filter(user => user.id !== id) }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  addEvent: async (eventData) => {
    try {
      const newEvent = await eventService.create(eventData);
      set(state => ({ events: [...state.events, newEvent] }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const updatedEvent = await eventService.update(id, eventData);
      set(state => ({
        events: state.events.map(event =>
          event.id === id ? updatedEvent : event
        )
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await eventService.delete(id);
      set(state => ({ events: state.events.filter(event => event.id !== id) }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  },

  updateEventStatus: async (id, status) => {
    console.log('Store: Mise à jour du statut', { id, status });
    try {
      const updatedEvent = await eventService.updateStatus(id, status);
      console.log('Store: Événement mis à jour', updatedEvent);
      set(state => ({
        events: state.events.map(event =>
          event.id === id ? updatedEvent : event
        )
      }));
      console.log('Store: État mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'événement:', error);
      throw error;
    }
  },

  addAssignment: async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      set(state => ({ 
        assignments: [...state.assignments, newAssignment],
        events: state.events.map(event => 
          event.id === assignmentData.eventId 
            ? { ...event, assignments: [...event.assignments, newAssignment] }
            : event
        )
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'affectation:', error);
      throw error;
    }
  },

  updateAssignment: async (id, assignmentData) => {
    try {
      const updatedAssignment = await assignmentService.update(id, assignmentData);
      set(state => ({
        assignments: state.assignments.map(assignment =>
          assignment.id === id ? updatedAssignment : assignment
        ),
        events: state.events.map(event => ({
          ...event,
          assignments: event.assignments.map(assignment =>
            assignment.id === id ? updatedAssignment : assignment
          )
        }))
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'affectation:', error);
      throw error;
    }
  },

  deleteAssignment: async (id) => {
    try {
      await assignmentService.delete(id);
      set(state => ({ 
        assignments: state.assignments.filter(assignment => assignment.id !== id),
        events: state.events.map(event => ({
          ...event,
          assignments: event.assignments.filter(assignment => assignment.id !== id)
        }))
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'affectation:', error);
      throw error;
    }
  },

  loadInitialData: async () => {
    set({ isLoading: true });
    
    try {
      // Charger les données en parallèle
      const [users, events, assignments, skills, eventTypes] = await Promise.all([
        userService.getAll(),
        eventService.getAll(),
        assignmentService.getAll(),
        skillService.getAll(),
        eventTypeService.getAll(),
      ]);

      // Si aucune donnée n'existe, initialiser avec les données par défaut
      if (skills.length === 0) {
        for (const skill of defaultSkills) {
          await skillService.create(skill);
        }
      }

      if (eventTypes.length === 0) {
        for (const type of defaultEventTypes) {
          await eventTypeService.create(type);
        }
      }

      // Lier les affectations aux événements
      const eventsWithAssignments = events.map(event => ({
        ...event,
        assignments: assignments.filter(assignment => assignment.eventId === event.id)
      }));

      set({
        users,
        events: eventsWithAssignments,
        assignments,
        skills: skills.length > 0 ? skills : defaultSkills,
        eventTypes: eventTypes.length > 0 ? eventTypes : defaultEventTypes,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      set({ isLoading: false });
      
      // Gestion d'erreur plus robuste
      if (error instanceof Error) {
        // Ne pas propager les erreurs 401 (non authentifié)
        if (error.message.includes('401') || error.message.includes('JWT')) {
          console.log('Utilisateur non authentifié, données non chargées');
          return;
        }
        throw new Error(`Erreur de chargement: ${error.message}`);
      } else {
        throw new Error('Erreur de chargement des données');
      }
    }
  },
}));