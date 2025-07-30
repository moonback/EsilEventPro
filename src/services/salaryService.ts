import { 
  SalaryCalculation, 
  SalaryAssignment, 
  SalaryBonus, 
  SalaryDeduction, 
  SalaryPeriod, 
  SalarySettings,
  Assignment,
  Event,
  User
} from '../types';
import { format, differenceInHours, isWeekend } from 'date-fns';

const SALARY_STORAGE_KEY = 'esil_salary_calculations';
const SALARY_SETTINGS_KEY = 'esil_salary_settings';
const SALARY_PERIODS_KEY = 'esil_salary_periods';

// Fonction pour détecter les jours fériés français
function isFrenchHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Jours fériés français fixes
  const fixedHolidays = [
    { month: 1, day: 1 },   // Nouvel An
    { month: 5, day: 1 },   // Fête du Travail
    { month: 5, day: 8 },   // Victoire 1945
    { month: 7, day: 14 },  // Fête Nationale
    { month: 8, day: 15 },  // Assomption
    { month: 11, day: 1 },  // Toussaint
    { month: 11, day: 11 }, // Armistice 1918
    { month: 12, day: 25 }, // Noël
  ];
  
  // Vérifier les jours fériés fixes
  for (const holiday of fixedHolidays) {
    if (month === holiday.month && day === holiday.day) {
      return true;
    }
  }
  
  // Pâques et jours fériés mobiles (calcul approximatif)
  // Note: Pour un calcul précis, il faudrait utiliser une bibliothèque spécialisée
  // Cette implémentation est simplifiée
  const easterSunday = getEasterSunday(year);
  const easterMonday = new Date(easterSunday);
  easterMonday.setDate(easterSunday.getDate() + 1);
  
  const ascension = new Date(easterSunday);
  ascension.setDate(easterSunday.getDate() + 39);
  
  const pentecote = new Date(easterSunday);
  pentecote.setDate(easterSunday.getDate() + 49);
  
  const pentecoteMonday = new Date(easterSunday);
  pentecoteMonday.setDate(easterSunday.getDate() + 50);
  
  const mobileHolidays = [easterMonday, ascension, pentecote, pentecoteMonday];
  
  for (const holiday of mobileHolidays) {
    if (holiday.getMonth() + 1 === month && holiday.getDate() === day) {
      return true;
    }
  }
  
  return false;
}

// Fonction pour calculer le dimanche de Pâques (algorithme de Meeus)
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

// Service de gestion des salaires avec stockage local
export class SalaryService {
  private static instance: SalaryService;
  private calculations: SalaryCalculation[] = [];
  private settings: SalarySettings;
  private periods: SalaryPeriod[] = [];

  constructor() {
    this.loadFromLocalStorage();
    this.initializeDefaultSettings();
  }

  static getInstance(): SalaryService {
    if (!SalaryService.instance) {
      SalaryService.instance = new SalaryService();
    }
    return SalaryService.instance;
  }

  // Chargement depuis le stockage local
  private loadFromLocalStorage(): void {
    try {
      const storedCalculations = localStorage.getItem(SALARY_STORAGE_KEY);
      const storedSettings = localStorage.getItem(SALARY_SETTINGS_KEY);
      const storedPeriods = localStorage.getItem(SALARY_PERIODS_KEY);

      if (storedCalculations) {
        this.calculations = JSON.parse(storedCalculations).map((calc: any) => ({
          ...calc,
          period: {
            start: new Date(calc.period.start),
            end: new Date(calc.period.end)
          },
          assignments: calc.assignments.map((assignment: any) => ({
            ...assignment,
            eventDate: new Date(assignment.eventDate)
          })),
          createdAt: new Date(calc.createdAt),
          updatedAt: new Date(calc.updatedAt)
        }));
      }

      if (storedSettings) {
        this.settings = JSON.parse(storedSettings);
      }

      if (storedPeriods) {
        this.periods = JSON.parse(storedPeriods).map((period: any) => ({
          ...period,
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de salaire:', error);
    }
  }

  // Sauvegarde dans le stockage local
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(SALARY_STORAGE_KEY, JSON.stringify(this.calculations));
      localStorage.setItem(SALARY_SETTINGS_KEY, JSON.stringify(this.settings));
      localStorage.setItem(SALARY_PERIODS_KEY, JSON.stringify(this.periods));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données de salaire:', error);
    }
  }

  // Initialisation des paramètres par défaut
  private initializeDefaultSettings(): void {
    if (!this.settings) {
      this.settings = {
        defaultHourlyRate: 25,
        overtimeMultiplier: 1.5,
        weekendMultiplier: 1.25,
        holidayMultiplier: 2.0,
        taxRate: 0.20,
        insuranceRate: 0.05,
        currency: 'EUR'
      };
      this.saveToLocalStorage();
    }
  }

  // Génération automatique des salaires pour une période
  async generateSalariesForPeriod(
    periodId: string,
    assignments: Assignment[],
    events: Event[],
    technicians: User[]
  ): Promise<SalaryCalculation[]> {
    const period = this.periods.find(p => p.id === periodId);
    if (!period) {
      throw new Error('Période non trouvée');
    }

    const calculations: SalaryCalculation[] = [];

    for (const technician of technicians.filter(t => t.role === 'technician')) {
      const technicianAssignments = assignments.filter(
        a => a.technicianId === technician.id && a.status === 'accepted'
      );

      if (technicianAssignments.length === 0) continue;

      const salaryCalculation = await this.calculateTechnicianSalary(
        technician,
        technicianAssignments,
        events,
        period
      );

      calculations.push(salaryCalculation);
    }

    // Sauvegarde des calculs
    this.calculations.push(...calculations);
    this.saveToLocalStorage();

    return calculations;
  }

  // Calcul du salaire pour un technicien
  private async calculateTechnicianSalary(
    technician: User,
    assignments: Assignment[],
    events: Event[],
    period: SalaryPeriod
  ): Promise<SalaryCalculation> {
    const salaryAssignments: SalaryAssignment[] = [];
    let totalHours = 0;
    let totalSalary = 0;

    // Traitement des affectations dans la période
    for (const assignment of assignments) {
      const event = events.find(e => e.id === assignment.eventId);
      if (!event) continue;

      const eventDate = new Date(event.startDate);
      if (eventDate < period.startDate || eventDate > period.endDate) continue;

      const hours = differenceInHours(new Date(event.endDate), new Date(event.startDate));
      const hourlyRate = technician.hourlyRate || this.settings.defaultHourlyRate;
      
      // Calcul du taux selon les conditions
      let adjustedRate = hourlyRate;
      if (isWeekend(eventDate)) {
        adjustedRate *= this.settings.weekendMultiplier;
      }
      if (isFrenchHoliday(eventDate)) {
        adjustedRate *= this.settings.holidayMultiplier;
      }
      if (hours > 8) {
        const overtimeHours = hours - 8;
        const regularHours = 8;
        adjustedRate = (regularHours * hourlyRate + overtimeHours * hourlyRate * this.settings.overtimeMultiplier) / hours;
      }

      const assignmentTotal = hours * adjustedRate;

      salaryAssignments.push({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: eventDate,
        hours,
        hourlyRate: adjustedRate,
        total: assignmentTotal
      });

      totalHours += hours;
      totalSalary += assignmentTotal;
    }

    // Calcul des bonus
    const bonuses = this.calculateBonuses(technician, totalHours, totalSalary);

    // Calcul des déductions
    const deductions = this.calculateDeductions(totalSalary);

    // Calcul du salaire net
    const totalBonuses = bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);
    const totalDeductions = deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const netSalary = totalSalary + totalBonuses - totalDeductions;

    return {
      id: `salary_${technician.id}_${period.id}_${Date.now()}`,
      technicianId: technician.id,
      technicianName: `${technician.firstName} ${technician.lastName}`,
      period: {
        start: period.startDate,
        end: period.endDate
      },
      assignments: salaryAssignments,
      totalHours,
      hourlyRate: technician.hourlyRate || this.settings.defaultHourlyRate,
      totalSalary,
      bonuses,
      deductions,
      netSalary,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Calcul des bonus
  private calculateBonuses(
    technician: User,
    totalHours: number,
    totalSalary: number
  ): SalaryBonus[] {
    const bonuses: SalaryBonus[] = [];

    // Bonus pour heures supplémentaires
    if (totalHours > 160) {
      const overtimeHours = totalHours - 160;
      const overtimeBonus = overtimeHours * (technician.hourlyRate || this.settings.defaultHourlyRate) * 0.5;
      bonuses.push({
        id: `bonus_overtime_${Date.now()}`,
        type: 'overtime',
        description: `Bonus heures supplémentaires (${overtimeHours}h)`,
        amount: overtimeBonus
      });
    }

    // Bonus de performance (si plus de 20 événements)
    const eventCount = technician.assignments?.length || 0;
    if (eventCount > 20) {
      const performanceBonus = totalSalary * 0.05;
      bonuses.push({
        id: `bonus_performance_${Date.now()}`,
        type: 'performance',
        description: 'Bonus de performance (20+ événements)',
        amount: performanceBonus,
        percentage: 5
      });
    }

    return bonuses;
  }

  // Calcul des déductions
  private calculateDeductions(totalSalary: number): SalaryDeduction[] {
    const deductions: SalaryDeduction[] = [];

    // Taxes
    const taxAmount = totalSalary * this.settings.taxRate;
    deductions.push({
      id: `deduction_tax_${Date.now()}`,
      type: 'tax',
      description: 'Impôts sur le revenu',
      amount: taxAmount,
      percentage: this.settings.taxRate * 100
    });

    // Assurance
    const insuranceAmount = totalSalary * this.settings.insuranceRate;
    deductions.push({
      id: `deduction_insurance_${Date.now()}`,
      type: 'insurance',
      description: 'Cotisations sociales',
      amount: insuranceAmount,
      percentage: this.settings.insuranceRate * 100
    });

    return deductions;
  }

  // Récupération des calculs de salaire
  getSalaryCalculations(): SalaryCalculation[] {
    return this.calculations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Récupération d'un calcul spécifique
  getSalaryCalculation(id: string): SalaryCalculation | undefined {
    return this.calculations.find(calc => calc.id === id);
  }

  // Mise à jour du statut d'un calcul
  updateSalaryStatus(id: string, status: 'draft' | 'approved' | 'paid'): void {
    const calculation = this.calculations.find(calc => calc.id === id);
    if (calculation) {
      calculation.status = status;
      calculation.updatedAt = new Date();
      this.saveToLocalStorage();
    }
  }

  // Suppression d'un calcul
  deleteSalaryCalculation(id: string): void {
    this.calculations = this.calculations.filter(calc => calc.id !== id);
    this.saveToLocalStorage();
  }

  // Gestion des périodes de paie
  getSalaryPeriods(): SalaryPeriod[] {
    return this.periods;
  }

  addSalaryPeriod(period: Omit<SalaryPeriod, 'id'>): void {
    const newPeriod: SalaryPeriod = {
      ...period,
      id: `period_${Date.now()}`
    };
    this.periods.push(newPeriod);
    this.saveToLocalStorage();
  }

  // Gestion des paramètres
  getSalarySettings(): SalarySettings {
    return this.settings;
  }

  updateSalarySettings(settings: Partial<SalarySettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveToLocalStorage();
  }

  // Export des données
  exportSalaryData(): string {
    return JSON.stringify({
      calculations: this.calculations,
      settings: this.settings,
      periods: this.periods
    }, null, 2);
  }

  // Import des données
  importSalaryData(data: string): void {
    try {
      const importedData = JSON.parse(data);
      this.calculations = importedData.calculations || [];
      this.settings = importedData.settings || this.settings;
      this.periods = importedData.periods || [];
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Erreur lors de l\'import des données de salaire:', error);
      throw new Error('Format de données invalide');
    }
  }

  // Nettoyage des données
  clearSalaryData(): void {
    this.calculations = [];
    this.periods = [];
    this.saveToLocalStorage();
  }
}

export const salaryService = SalaryService.getInstance(); 