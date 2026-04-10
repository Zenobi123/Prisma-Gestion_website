
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { saveAppointment } from '@/utils/appointment/crud';
import { validateAppointmentForm } from '@/utils/appointment/validation';
import type { AppointmentFormData } from '@/utils/appointment/types';

export const useAppointmentSubmit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (
    formData: AppointmentFormData,
    setIsSubmitting: (value: boolean) => void,
    resetForm: () => void
  ) => {
    if (!formData.fullName || !formData.phone || !formData.subject || !formData.date || !formData.time) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await saveAppointment(formData);
      
      toast({
        title: "Rendez-vous confirmé",
        description: "Votre demande de rendez-vous a été envoyée avec succès.",
      });
      
      resetForm();
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande de rendez-vous:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
