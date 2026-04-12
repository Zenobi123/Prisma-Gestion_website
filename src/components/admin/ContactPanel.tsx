
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ContactMessage } from '@/utils/contact/types';
import { 
  getContactMessages, 
  markMessageAsRead, 
  deleteContactMessage 
} from '@/utils/contact/supabase';
import MessageList from './messages/MessageList';
import MessageDetail from './messages/MessageDetail';
import DeleteConfirmDialog from './messages/DeleteConfirmDialog';
import { supabase } from '@/integrations/supabase/client';

const ContactPanel = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger les messages
  const loadMessages = async () => {
    try {
      const messagesFromStorage = await getContactMessages();
      console.log('Messages chargés de Supabase:', messagesFromStorage.length);
      setMessages(messagesFromStorage);
      
      // Si le message sélectionné existe toujours, le mettre à jour
      if (selectedMessage) {
        const updatedSelectedMessage = messagesFromStorage.find(msg => msg.id === selectedMessage.id);
        setSelectedMessage(updatedSelectedMessage || null);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages de contact.",
        variant: "destructive",
      });
    }
  };

  // Effet pour charger les messages au chargement initial et configurer les écouteurs d'événements
  useEffect(() => {
    // Charger immédiatement au montage
    loadMessages();
    
    // Configurer les écouteurs d'événements pour les mises à jour en temps réel de Supabase
    const channel = supabase
      .channel('admin-contact-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('ContactPanel: Changement détecté dans Supabase:', payload);
          loadMessages();
        }
      )
      .subscribe();
    
    // Configurer un écouteur pour l'événement personnalisé
    const handleCustomEvent = (e: Event) => {
      console.log('ContactPanel: Événement personnalisé détecté');
      loadMessages();
    };
    
    window.addEventListener('contactMessagesUpdated', handleCustomEvent as EventListener);
    
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('contactMessagesUpdated', handleCustomEvent as EventListener);
    };
  }, [toast, selectedMessage]);

  const handleViewMessage = async (message: ContactMessage) => {
    // Marquer le message comme lu s'il ne l'est pas déjà
    if (!message.read) {
      try {
        await markMessageAsRead(message.id);
        // loadMessages sera appelé automatiquement grâce à l'écouteur Supabase
      } catch (error) {
        console.error('Erreur lors du marquage du message comme lu:', error);
      }
    }
    setSelectedMessage(message);
  };

  const handleDeleteMessage = (id: string) => {
    setMessageToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      await deleteContactMessage(messageToDelete);
      
      if (selectedMessage?.id === messageToDelete) {
        setSelectedMessage(null);
      }
      
      // loadMessages sera appelé automatiquement grâce à l'écouteur Supabase
      
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message.",
        variant: "destructive",
      });
    }
    
    setShowDeleteDialog(false);
    setMessageToDelete(null);
  };

  const unreadCount = messages.filter(message => !message.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Gérez les messages reçus via le formulaire de contact.
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-prisma-purple">
                {unreadCount} {unreadCount === 1 ? 'nouveau message' : 'nouveaux messages'}
              </Badge>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MessageList 
          messages={messages}
          selectedMessageId={selectedMessage?.id || null}
          onSelectMessage={handleViewMessage}
          onDeleteMessage={handleDeleteMessage}
        />
        <MessageDetail 
          message={selectedMessage} 
          onDeleteMessage={handleDeleteMessage} 
        />
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default ContactPanel;
