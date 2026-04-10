
import { AppointmentFormData } from './types';

export const validateAppointmentForm = (formData: AppointmentFormData): { isValid: boolean, errorMessage?: string } => {
  if (!formData.fullName || !formData.phone || !formData.date || !formData.time) {
    return {
      isValid: false,
      errorMessage: "Veuillez remplir tous les champs obligatoires."
    };
  }

  const phoneRegex = /^\d{9,15}$/;
  if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
    return {
      isValid: false,
      errorMessage: "Veuillez entrer un numéro de téléphone valide (minimum 9 chiffres)."
    };
  }

  return { isValid: true };
};

