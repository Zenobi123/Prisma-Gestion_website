
import { supabase } from "@/integrations/supabase/client";
import { Appointment, AppointmentFormData, AppointmentStatus } from './types';
import { sendAppointmentEmail } from '@/utils/email/sendEmail';

export const saveAppointment = async (formData: AppointmentFormData): Promise<Appointment> => {
  try {
    const appointmentData = {
      full_name: formData.fullName,
      phone: formData.phone,
      subject: formData.subject,
      appointment_date: formData.date,
      appointment_time: formData.time,
      message: formData.message,
      status: "pending" as AppointmentStatus,
    };
    
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select('*')
      .single();
    
    if (error) {
      // Supabase désactivé : envoi par email directement
      if ((error as { code?: string }).code === 'SUPABASE_DISABLED') {
        console.log('Supabase désactivé – envoi du rendez-vous par email.');
        await sendAppointmentEmail(formData);
        return {
          id: `appointment-${Date.now()}`,
          fullName: formData.fullName,
          phone: formData.phone,
          subject: formData.subject,
          date: formData.date,
          time: formData.time,
          message: formData.message,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
      }
      console.error('Erreur lors de la sauvegarde du rendez-vous dans Supabase:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error('Aucune donnée retournée après l\'insertion');
    }
    
    console.log('Rendez-vous sauvegardé avec succès dans Supabase:', data);
    
    return {
      id: data.id,
      fullName: data.full_name,
      phone: data.phone,
      subject: data.subject,
      date: data.appointment_date,
      time: data.appointment_time,
      message: data.message,
      createdAt: data.created_at,
      status: data.status as AppointmentStatus,
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du rendez-vous:', error);
    throw new Error('Impossible de sauvegarder le rendez-vous');
  }
};

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des rendez-vous depuis Supabase:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('Aucun rendez-vous trouvé dans Supabase');
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      fullName: item.full_name,
      phone: item.phone,
      subject: item.subject,
      date: item.appointment_date,
      time: item.appointment_time,
      message: item.message,
      createdAt: item.created_at,
      status: item.status as AppointmentStatus,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return [];
  }
};

export const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous dans Supabase:', error);
      throw new Error(error.message);
    }
    
    console.log('Statut du rendez-vous mis à jour dans Supabase:', appointmentId, status);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);
    
    if (error) {
      console.error('Erreur lors de la suppression du rendez-vous dans Supabase:', error);
      throw new Error(error.message);
    }
    
    console.log('Rendez-vous supprimé dans Supabase:', appointmentId);
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    throw error;
  }
};

