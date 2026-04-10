
import { useState } from 'react';
import { AppointmentFormData } from '@/utils/appointment/types';

const defaultFormData: AppointmentFormData = {
  fullName: '',
  phone: '',
  subject: '',
  date: '',
  time: undefined,
  message: ''
};

export const useAppointmentState = () => {
  const [formData, setFormData] = useState<AppointmentFormData>(defaultFormData);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        date: ''
      }));
    }
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  return {
    formData,
    date,
    isSubmitting,
    setFormData,
    setIsSubmitting,
    handleInputChange,
    handleDateChange,
    handleTimeChange,
    resetForm: () => {
      setFormData(defaultFormData);
      setDate(undefined);
    }
  };
};
