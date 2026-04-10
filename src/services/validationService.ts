
import { z } from 'zod';

// Schémas de validation Zod pour sécuriser les entrées
export const contactSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string().email('Email invalide').max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro WhatsApp invalide').max(20, 'Le numéro ne peut pas dépasser 20 caractères'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères').max(100, 'Le sujet ne peut pas dépasser 100 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
});

export const quoteSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string().email('Email invalide').max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide').max(20, 'Le numéro ne peut pas dépasser 20 caractères'),
  service: z.string().min(1, 'Veuillez sélectionner un service').max(50, 'Le service ne peut pas dépasser 50 caractères'),
  details: z.string().min(10, 'Les détails doivent contenir au moins 10 caractères').max(2000, 'Les détails ne peuvent pas dépasser 2000 caractères'),
});

export const appointmentSchema = z.object({
  fullName: z.string().min(2, 'Le nom complet doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Numéro de téléphone invalide').max(20, 'Le numéro ne peut pas dépasser 20 caractères'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères').max(100, 'Le sujet ne peut pas dépasser 100 caractères'),
  appointmentDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'La date ne peut pas être dans le passé'),
  appointmentTime: z.string().min(1, 'Veuillez sélectionner une heure'),
  message: z.string().max(500, 'Le message ne peut pas dépasser 500 caractères').optional(),
});

// Fonction de sanitisation pour prévenir les attaques XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Supprimer les balises HTML basiques
    .replace(/javascript:/gi, '') // Supprimer les liens javascript
    .replace(/on\w+=/gi, '') // Supprimer les handlers d'événements
    .trim();
};

// Validation des données avec sanitisation
export const validateAndSanitize = <T>(data: unknown, schema: z.ZodSchema<T>): { success: boolean; data?: T; errors?: string[] } => {
  try {
    // Sanitiser d'abord si c'est un objet avec des chaînes
    const sanitizedData = typeof data === 'object' && data !== null 
      ? Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            typeof value === 'string' ? sanitizeInput(value) : value
          ])
        )
      : data;

    const result = schema.parse(sanitizedData);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation inconnue'] };
  }
};

// Rate limiting simple côté client (à compléter avec du rate limiting serveur)
class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Nettoyer les anciennes tentatives
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new ClientRateLimiter();
