
import { z } from 'zod';

export type AppointmentStatus = "pending" | "confirmed" | "canceled" | "completed";

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  subject: string;
  date: string;
  time: string;
  message: string | null;
  createdAt: string;
  status: AppointmentStatus;
}

export type AppointmentFormData = {
  fullName: string;
  phone: string;
  subject: string;
  date: string;
  time: string | undefined;
  message: string;
};

export const appointmentFormSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  phone: z.string().regex(/^\d{9,15}$/, "Numéro de téléphone invalide"),
  subject: z.string().min(1, "Le sujet est requis"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  message: z.string().optional(),
});

