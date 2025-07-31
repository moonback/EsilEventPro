import { EventFormData } from '../types';

export interface ICalEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  created?: Date;
  lastModified?: Date;
}

export class ICalParser {
  private static parseDate(dateString: string): Date {
    // Supprimer les caractères non désirés et normaliser
    let cleanDate = dateString.replace(/[TZ]/g, '');
    
    // Si la date fait moins de 15 caractères, ajouter des zéros
    while (cleanDate.length < 15) {
      cleanDate += '0';
    }
    
    // Format attendu: YYYYMMDDHHMMSS
    const year = parseInt(cleanDate.substring(0, 4));
    const month = parseInt(cleanDate.substring(4, 6)) - 1; // Les mois commencent à 0
    const day = parseInt(cleanDate.substring(6, 8));
    const hour = parseInt(cleanDate.substring(8, 10));
    const minute = parseInt(cleanDate.substring(10, 12));
    const second = parseInt(cleanDate.substring(12, 14));
    
    return new Date(year, month, day, hour, minute, second);
  }

  private static parseLine(line: string): { key: string; value: string; params?: Record<string, string> } {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return { key: '', value: '' };

    const keyPart = line.substring(0, colonIndex);
    const value = line.substring(colonIndex + 1);

    // Parser les paramètres (ex: DTSTART;TZID=Europe/Paris:20231201T100000)
    const semicolonIndex = keyPart.indexOf(';');
    let key = keyPart;
    let params: Record<string, string> = {};

    if (semicolonIndex !== -1) {
      key = keyPart.substring(0, semicolonIndex);
      const paramsString = keyPart.substring(semicolonIndex + 1);
      paramsString.split(';').forEach(param => {
        const equalIndex = param.indexOf('=');
        if (equalIndex !== -1) {
          const paramKey = param.substring(0, equalIndex);
          const paramValue = param.substring(equalIndex + 1);
          params[paramKey] = paramValue;
        }
      });
    }

    return { key, value, params };
  }

  static parseICalContent(content: string): ICalEvent[] {
    const events: ICalEvent[] = [];
    const lines = content.split('\n');
    
    let currentEvent: Partial<ICalEvent> = {};
    let inEvent = false;
    let currentKey = '';
    let currentValue = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === 'BEGIN:VEVENT') {
        currentEvent = {};
        inEvent = true;
        continue;
      }

      if (line === 'END:VEVENT') {
        if (inEvent && currentEvent.uid && currentEvent.summary && currentEvent.startDate && currentEvent.endDate) {
          events.push(currentEvent as ICalEvent);
        }
        inEvent = false;
        currentEvent = {};
        continue;
      }

      if (!inEvent) continue;

      // Gérer les lignes continues (commençant par un espace)
      if (line.startsWith(' ') || line.startsWith('\t')) {
        currentValue += line.substring(1);
        continue;
      }

      // Traiter la ligne précédente si elle existe
      if (currentKey) {
        const { key, value, params } = this.parseLine(currentKey + ':' + currentValue);
        this.processEventProperty(currentEvent, key, value, params);
      }

      // Commencer une nouvelle ligne
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        currentKey = line.substring(0, colonIndex);
        currentValue = line.substring(colonIndex + 1);
      } else {
        currentKey = '';
        currentValue = '';
      }
    }

    // Traiter la dernière ligne
    if (currentKey && inEvent) {
      const { key, value, params } = this.parseLine(currentKey + ':' + currentValue);
      this.processEventProperty(currentEvent, key, value, params);
    }

    return events;
  }

  private static processEventProperty(event: Partial<ICalEvent>, key: string, value: string, params?: Record<string, string>) {
    switch (key) {
      case 'UID':
        event.uid = value;
        break;
      case 'SUMMARY':
        event.summary = value;
        break;
      case 'DESCRIPTION':
        event.description = value;
        break;
      case 'LOCATION':
        event.location = value;
        break;
      case 'DTSTART':
        event.startDate = this.parseDate(value);
        break;
      case 'DTEND':
        event.endDate = this.parseDate(value);
        break;
      case 'CREATED':
        event.created = this.parseDate(value);
        break;
      case 'LAST-MODIFIED':
        event.lastModified = this.parseDate(value);
        break;
    }
  }
}

export const icalService = {
  async parseFile(file: File): Promise<ICalEvent[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const events = ICalParser.parseICalContent(content);
          resolve(events);
        } catch (error) {
          reject(new Error('Erreur lors du parsing du fichier iCal'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsText(file);
    });
  },

  convertToEventFormData(icalEvent: ICalEvent, defaultTypeId: string): EventFormData {
    return {
      title: icalEvent.summary,
      description: icalEvent.description || '',
      startDate: icalEvent.startDate,
      endDate: icalEvent.endDate,
      location: icalEvent.location || '',
      typeId: defaultTypeId,
      requiredTechnicians: [],
    };
  },

  validateEvent(event: ICalEvent): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!event.summary || event.summary.trim() === '') {
      errors.push('Le titre de l\'événement est requis');
    }

    if (!event.startDate) {
      errors.push('La date de début est requise');
    }

    if (!event.endDate) {
      errors.push('La date de fin est requise');
    }

    if (event.startDate && event.endDate && event.startDate >= event.endDate) {
      errors.push('La date de début doit être antérieure à la date de fin');
    }

    if (event.startDate && event.startDate < new Date()) {
      errors.push('La date de début ne peut pas être dans le passé');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}; 