
import type { ContactMessage } from "./types";

// Fonction pour déclencher l'événement de mise à jour des notifications
export const triggerNotificationsUpdated = (data: { 
  unreadContactCount?: number, 
  pendingAppointmentCount?: number,
  unreadQuotesCount?: number 
}) => {
  console.log("Déclenchement de l'événement notifications-updated avec", data);
  const event = new CustomEvent('notifications-updated', {
    detail: data
  });
  window.dispatchEvent(event);
};

// Fonction pour déclencher l'événement personnalisé de mise à jour des messages
export const triggerContactMessagesUpdated = (messages: ContactMessage[]) => {
  console.log("Déclenchement de l'événement contactMessagesUpdated avec", messages.length, "messages");
  const event = new CustomEvent('contactMessagesUpdated', {
    detail: { messages }
  });
  window.dispatchEvent(event);
  
  // Mettre à jour les notifications dans le header
  const unreadCount = messages.filter(msg => !msg.read).length;
  triggerNotificationsUpdated({ unreadContactCount: unreadCount });
};

