import FormInput from '@/components/contact/form/FormInput';
import FormTextarea from '@/components/contact/form/FormTextarea';
import { DateTimeSelector } from './DateTimeSelector';
import SubmitButton from '@/components/SubmitButton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppointmentForm } from '@/hooks/appointment';

export const AppointmentForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    date,
    isSubmitting,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit
  } = useAppointmentForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="fullName"
        label="Nom complet"
        value={formData.fullName}
        placeholder="Votre nom et prénom"
        onChange={handleInputChange}
        required
      />
      
      <FormInput
        id="phone"
        label="Numéro de téléphone"
        type="tel"
        value={formData.phone}
        placeholder="Ex: 6XX XXX XXX"
        onChange={handleInputChange}
        required
      />
      
      <FormInput
        id="subject"
        label="Sujet du rendez-vous"
        value={formData.subject}
        placeholder="Ex: Consultation comptable"
        onChange={handleInputChange}
        required
      />
      
      <DateTimeSelector
        date={date}
        time={formData.time}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
      />
      
      <FormTextarea
        id="message"
        label="Message (optionnel)"
        value={formData.message}
        placeholder="Informations supplémentaires concernant votre rendez-vous"
        onChange={handleInputChange}
      />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate('/')}
        >
          Annuler
        </Button>
        <SubmitButton 
          isSubmitting={isSubmitting} 
          text="Confirmer le rendez-vous"
          loadingText="Envoi en cours..."
        />
      </div>
    </form>
  );
};
