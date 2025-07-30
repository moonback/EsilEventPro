import { create } from 'zustand';
import { AppState, Event, User, Assignment, Skill, EventType } from '../types';
import { addDays, startOfDay } from 'date-fns';

interface AppStore extends AppState {
  // Users
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Events
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Assignments
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  
  // Data loading
  loadInitialData: () => void;
}

// Données d'exemple
const mockSkills: Skill[] = [
  { id: '1', name: 'Mixage Audio', category: 'sound', level: 'expert' },
  { id: '2', name: 'Installation Sono', category: 'sound', level: 'intermediate' },
  { id: '3', name: 'Éclairage Scène', category: 'lighting', level: 'expert' },
  { id: '4', name: 'Projecteurs LED', category: 'lighting', level: 'intermediate' },
  { id: '5', name: 'Régie Vidéo', category: 'video', level: 'expert' },
  { id: '6', name: 'Captation Multi-Cam', category: 'video', level: 'expert' },
];

const mockEventTypes: EventType[] = [
  { id: '1', name: 'Concert', color: '#3B82F6', defaultDuration: 6 },
  { id: '2', name: 'Conférence', color: '#10B981', defaultDuration: 8 },
  { id: '3', name: 'Mariage', color: '#F59E0B', defaultDuration: 12 },
  { id: '4', name: 'Festival', color: '#EF4444', defaultDuration: 24 },
  { id: '5', name: 'Spectacle', color: '#8B5CF6', defaultDuration: 4 },
];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@eventpro.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin',
    phone: '+33123456789',
    skills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'jean.dupont@eventpro.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'technician',
    phone: '+33987654321',
    skills: [mockSkills[0], mockSkills[2]],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'marie.martin@eventpro.com',
    firstName: 'Marie',
    lastName: 'Martin',
    role: 'technician',
    phone: '+33456789123',
    skills: [mockSkills[1], mockSkills[3], mockSkills[4]],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Concert Jazz Festival',
    description: 'Concert de jazz en plein air avec 3 scènes simultanées',
    startDate: addDays(startOfDay(new Date()), 3),
    endDate: addDays(startOfDay(new Date()), 3),
    location: 'Parc Central',
    type: mockEventTypes[0],
    requiredTechnicians: [
      { skillId: '1', count: 2, level: 'expert' },
      { skillId: '3', count: 3, level: 'intermediate' },
    ],
    assignments: [],
    status: 'published',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Conférence Tech Summit',
    description: 'Conférence technologique avec retransmission en direct',
    startDate: addDays(startOfDay(new Date()), 7),
    endDate: addDays(startOfDay(new Date()), 7),
    location: 'Centre de Congrès',
    type: mockEventTypes[1],
    requiredTechnicians: [
      { skillId: '2', count: 1, level: 'intermediate' },
      { skillId: '5', count: 2, level: 'expert' },
    ],
    assignments: [],
    status: 'draft',
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useAppStore = create<AppStore>((set, get) => ({
  users: [],
  events: [],
  assignments: [],
  skills: [],
  eventTypes: [],

  addUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set(state => ({ users: [...state.users, newUser] }));
  },

  updateUser: (id, userData) => {
    set(state => ({
      users: state.users.map(user =>
        user.id === id ? { ...user, ...userData, updatedAt: new Date() } : user
      )
    }));
  },

  deleteUser: (id) => {
    set(state => ({ users: state.users.filter(user => user.id !== id) }));
  },

  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set(state => ({ events: [...state.events, newEvent] }));
  },

  updateEvent: (id, eventData) => {
    set(state => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, ...eventData, updatedAt: new Date() } : event
      )
    }));
  },

  deleteEvent: (id) => {
    set(state => ({ events: state.events.filter(event => event.id !== id) }));
  },

  addAssignment: (assignmentData) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    set(state => ({ assignments: [...state.assignments, newAssignment] }));
  },

  updateAssignment: (id, assignmentData) => {
    set(state => ({
      assignments: state.assignments.map(assignment =>
        assignment.id === id ? { ...assignment, ...assignmentData } : assignment
      )
    }));
  },

  deleteAssignment: (id) => {
    set(state => ({ assignments: state.assignments.filter(assignment => assignment.id !== id) }));
  },

  loadInitialData: () => {
    set({
      users: mockUsers,
      events: mockEvents,
      assignments: [],
      skills: mockSkills,
      eventTypes: mockEventTypes,
    });
  },
}));