
import { useAppointmentState } from './useAppointmentState';
import { useAppointmentSubmit } from './useAppointmentSubmit';

export const useAppointmentForm = () => {
  const {
    formData,
    date,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    resetForm
  } = useAppointmentState();

  const { handleSubmit: submitForm } = useAppointmentSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData, setIsSubmitting, resetForm);
  };

  return {
    formData,
    date,
    isSubmitting,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit
  };
};
