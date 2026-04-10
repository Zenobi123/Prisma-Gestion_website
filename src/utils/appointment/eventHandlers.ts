
import { Appointment } from './types';

export const triggerAppointmentsUpdated = (appointments: Appointment[]) => {
  const event = new CustomEvent('appointmentsUpdated', {
    detail: { appointments }
  });
  window.dispatchEvent(event);
};

