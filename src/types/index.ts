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

// Types pour la gestion des salaires
export interface SalaryCalculation {
  id: string;
  technicianId: string;
  technicianName: string;
  period: {
    start: Date;
    end: Date;
  };
  assignments: SalaryAssignment[];
  totalHours: number;
  hourlyRate: number;
  totalSalary: number;
  bonuses: SalaryBonus[];
  deductions: SalaryDeduction[];
  netSalary: number;
  status: 'draft' | 'approved' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryAssignment {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  hours: number;
  hourlyRate: number;
  total: number;
}

export interface SalaryBonus {
  id: string;
  type: 'overtime' | 'weekend' | 'holiday' | 'special' | 'performance';
  description: string;
  amount: number;
  percentage?: number;
}

export interface SalaryDeduction {
  id: string;
  type: 'tax' | 'insurance' | 'absence' | 'other';
  description: string;
  amount: number;
  percentage?: number;
}

export interface SalaryPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface SalarySettings {
  defaultHourlyRate: number;
  overtimeMultiplier: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
  taxRate: number;
  insuranceRate: number;
  currency: string;
}