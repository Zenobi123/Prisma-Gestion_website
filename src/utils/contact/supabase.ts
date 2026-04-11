
import { supabase } from "@/integrations/supabase/client";
import type { ContactFormData, ContactMessage } from "./types";
import { triggerContactMessagesUpdated } from "./events";
import { sendContactEmail } from "@/utils/email/sendEmail";

// Sauvegarder un message de contact
export const saveContactMessage = async (formData: ContactFormData): Promise<ContactMessage> => {
  try {
    // Formater les données pour l'insertion dans Supabase
    const messageData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      subject: formData.subject,
      message: formData.message,
      // Les champs date et read sont définis par défaut dans la base de données
    };

    console.log('Tentative de sauvegarde du message dans Supabase:', messageData);

    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(messageData)
      .select('*')
      .single();

    if (error) {
      // Supabase désactivé : envoi par email directement
      if ((error as { code?: string }).code === 'SUPABASE_DISABLED') {
        console.log('Supabase désactivé – envoi du message par email.');
        await sendContactEmail(formData);
        return {
          id: `local-${Date.now()}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          subject: formData.subject,
          message: formData.message,
          date: new Date().toISOString(),
          read: false,
        };
      }
      console.error('Erreur lors de la sauvegarde du message dans Supabase:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      throw new Error('Aucune donnée retournée après l\'insertion');
    }
    
    console.log('Message sauvegardé avec succès dans Supabase:', data);
    
    // Convertir le format de données de Supabase au format attendu par l'application
    const newMessage: ContactMessage = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      whatsapp: data.whatsapp,
      subject: data.subject,
      message: data.message,
      date: data.date,
      read: data.read,
    };
    
    return newMessage;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du message:', error);
    throw new Error('Impossible de sauvegarder le message');
  }
};

// Récupérer tous les messages de contact
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    console.log('Tentative de récupération des messages depuis Supabase...');
    
    // Récupérer depuis Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des messages depuis Supabase:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('Aucun message trouvé dans Supabase');
      return [];
    }
    
    console.log('Données brutes récupérées:', data);
    
    // Convertir le format de données de Supabase au format attendu par l'application
    const messages: ContactMessage[] = data.map(item => ({
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      whatsapp: item.whatsapp,
      subject: item.subject,
      message: item.message,
      date: item.date,
      read: item.read,
    }));
    
    console.log('Messages chargés et convertis:', messages.length);
    return messages;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return [];
  }
};

// Marquer un message comme lu
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du message dans Supabase:', error);
      throw new Error(error.message);
    }
    
    console.log('Message marqué comme lu dans Supabase:', messageId);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    throw error;
  }
};

// Supprimer un message
export const deleteContactMessage = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Erreur lors de la suppression du message dans Supabase:', error);
      throw new Error(error.message);
    }
    
    console.log('Message supprimé dans Supabase:', messageId);
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    throw error;
  }
};

// Configuration de l'écouteur d'événements pour la synchronisation
export const setupStorageListener = () => {
  console.log('Configuration des écouteurs de mise à jour des messages');
  
  // Abonnement aux mises à jour en temps réel de Supabase
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'contact_messages'
      },
      (payload) => {
        console.log('Changement détecté dans la table contact_messages:', payload);
        getContactMessages().then(messages => {
          triggerContactMessagesUpdated(messages);
        });
      }
    )
    .subscribe();
    
  console.log('Canal Supabase configuré pour les messages de contact');
  
  return () => {
    supabase.removeChannel(channel);
  };
};

