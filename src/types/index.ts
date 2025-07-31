// Types de base pour l'application
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'technician';
  phone?: string;
  hourlyRate?: number; // Taux horaire en euros par heure
  skills: Skill[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: 'sound' | 'lighting' | 'video' | 'general' | 'stage';
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface MissionPricing {
  id: string;
  eventId: string;
  basePrice: number;
  pricePerHour: number;
  bonusPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TargetedTechnician {
  id: string;
  eventId: string;
  technicianId: string;
  selectedByAdmin: boolean;
  selectionReason?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: EventType;
  requiredTechnicians: TechnicianRequirement[];
  assignments: Assignment[];
  status: 'draft' | 'published' | 'confirmed' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  pricing?: MissionPricing;
  targetedTechnicians?: TargetedTechnician[];
}

export interface EventType {
  id: string;
  name: string;
  color: string;
  defaultDuration: number; // en heures
}

export interface TechnicianRequirement {
  skillId: string;
  count: number;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface Assignment {
  id: string;
  eventId: string;
  technicianId: string;
  status: 'pending' | 'accepted' | 'declined';
  responseDate?: Date;
  declineReason?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppState {
  users: User[];
  events: Event[];
  assignments: Assignment[];
  skills: Skill[];
  eventTypes: EventType[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'technician';
}

export interface EventFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  typeId: string;
  requiredTechnicians: TechnicianRequirement[];
  pricing?: {
    basePrice: number;
    pricePerHour: number;
    bonusPercentage: number;
  };
  targetedTechnicians?: string[]; // IDs des techniciens sélectionnés
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
}

export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}