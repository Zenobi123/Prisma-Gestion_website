
import type { ContactFormData } from "./types";

// Constante pour la clé localStorage (utilisée pour la rétrocompatibilité)
export const CONTACT_MESSAGES_KEY = 'contactMessages';

export const validateContactForm = (formData: ContactFormData): { 
  isValid: boolean, 
  errorMessage?: string,
  errors?: Partial<Record<keyof ContactFormData, string>>
} => {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  
  // Validation champ par champ
  if (!formData.firstName) {
    errors.firstName = "Le prénom est requis";
  }
  
  if (!formData.lastName) {
    errors.lastName = "Le nom est requis";
  }
  
  if (!formData.email) {
    errors.email = "L'email est requis";
  } else {
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Veuillez entrer une adresse email valide";
    }
  }
  
  if (!formData.whatsapp) {
    errors.whatsapp = "Le numéro WhatsApp est requis";
  } else {
    // Validation basique de numéro WhatsApp
    const cleanedNumber = formData.whatsapp.replace(/[\s\-()]/g, '');
    const phoneRegex = /^\+?\d{9,15}$/;
    if (!phoneRegex.test(cleanedNumber)) {
      errors.whatsapp = "Veuillez entrer un numéro WhatsApp valide (minimum 9 chiffres)";
    }
  }
  
  if (!formData.message) {
    errors.message = "Le message est requis";
  }
  
  // Vérifier s'il y a des erreurs
  const hasErrors = Object.keys(errors).length > 0;
  
  if (hasErrors) {
    return {
      isValid: false,
      errorMessage: "Veuillez remplir tous les champs obligatoires correctement.",
      errors
    };
  }

  return { isValid: true };
};

