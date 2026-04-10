
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ContactsTab from './messages/ContactsTab';
import AppointmentsTab from './messages/AppointmentsTab';
import QuotesTab from './messages/QuotesTab';
import CommentsTab from './messages/CommentsTab';
import { getContactMessages } from '@/utils/contact/supabase';
import { triggerNotificationsUpdated } from '@/utils/contact/events';
import { getAppointments } from '@/utils/appointment/crud';
import { getQuoteRequests } from '@/utils/quotes/getQuoteRequests';

const MessagesPanel = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [unreadContactCount, setUnreadContactCount] = useState(0);
  const [pendingAppointmentCount, setPendingAppointmentCount] = useState(0);
  const [unreadQuotesCount, setUnreadQuotesCount] = useState(0);

  // Récupérer le nombre de messages non lus
  const fetchUnreadCount = async () => {
    try {
      console.log("MessagesPanel: Chargement des compteurs de notification...");
      
      // Charger les messages de contact non lus
      const messages = await getContactMessages();
      console.log("MessagesPanel: Messages de contact récupérés:", messages.length);
      const contactCount = messages.filter(message => !message.read).length;
      setUnreadContactCount(contactCount);
      
      // Charger les rendez-vous en attente
      const appointments = await getAppointments();
      console.log("MessagesPanel: Rendez-vous récupérés:", appointments.length);
      const appointmentCount = appointments.filter(
        appointment => appointment.status === 'pending'
      ).length;
      setPendingAppointmentCount(appointmentCount);
      
      // Charger les devis non lus
      const quotes = await getQuoteRequests();
      console.log("MessagesPanel: Devis récupérés:", quotes.length);
      const quotesCount = quotes.filter(quote => !quote.read).length;
      setUnreadQuotesCount(quotesCount);
      
      // Déclencher un événement pour mettre à jour le header
      triggerNotificationsUpdated({ 
        unreadContactCount: contactCount,
        pendingAppointmentCount: appointmentCount,
        unreadQuotesCount: quotesCount
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des messages non lus:', error);
    }
  };

  // Surveiller la navigation entre les onglets
  useEffect(() => {
    // Écouter l'événement pour la navigation dans l'onglet Messages
    const handleMessageTabNavigate = (e: CustomEvent) => {
      if (e.detail && typeof e.detail === 'string') {
        setActiveTab(e.detail);
      }
    };
    
    document.addEventListener('message-tab-navigate', handleMessageTabNavigate as EventListener);
    
    return () => {
      document.removeEventListener('message-tab-navigate', handleMessageTabNavigate as EventListener);
    };
  }, []);

  // Mettre à jour le compteur à intervalles réguliers
  useEffect(() => {
    fetchUnreadCount();
    
    // Configurer un intervalle pour rafraîchir le compteur
    const intervalId = setInterval(fetchUnreadCount, 30000);
    
    // Écouter les événements de mise à jour des messages
    const handleMessagesUpdated = () => {
      console.log("MessagesPanel: Événement de mise à jour des messages détecté");
      fetchUnreadCount();
    };
    
    window.addEventListener('contactMessagesUpdated', handleMessagesUpdated);
    window.addEventListener('appointmentsUpdated', handleMessagesUpdated);
    window.addEventListener('quoteRequestsUpdated', handleMessagesUpdated);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('contactMessagesUpdated', handleMessagesUpdated);
      window.removeEventListener('appointmentsUpdated', handleMessagesUpdated);
      window.removeEventListener('quoteRequestsUpdated', handleMessagesUpdated);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Gérez tous les types de communications sur votre site.
          </p>
        </div>
      </div>

      <Tabs 
        defaultValue="contacts" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="contacts" className="relative">
            Contacts
            {unreadContactCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-prisma-purple text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                {unreadContactCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="relative">
            Rendez-vous
            {pendingAppointmentCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-[#D6DD00] text-[#2E1A47] text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                {pendingAppointmentCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="quotes" className="relative">
            Devis
            {unreadQuotesCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-[#D6DD00] text-[#2E1A47] text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                {unreadQuotesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="comments">
            Commentaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-6">
          <ContactsTab />
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-6">
          <AppointmentsTab />
        </TabsContent>
        
        <TabsContent value="quotes" className="mt-6">
          <QuotesTab />
        </TabsContent>
        
        <TabsContent value="comments" className="mt-6">
          <CommentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesPanel;
