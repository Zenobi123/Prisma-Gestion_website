
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ContactMessage } from '@/utils/contact/types';
import { 
  getContactMessages, 
  markMessageAsRead, 
  deleteContactMessage 
} from '@/utils/contact/supabase';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const ContactsTab = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Use optimized query with realtime updates
  const {
    data: messages = [],
    isLoading,
    invalidate
  } = useOptimizedQuery({
    queryKey: ['contact-messages'],
    queryFn: getContactMessages,
    tableName: 'contact_messages',
    realtimeEnabled: true
  });

  const handleViewMessage = async (message: ContactMessage) => {
    // Marquer le message comme lu s'il ne l'est pas déjà
    if (!message.read) {
      try {
        await markMessageAsRead(message.id);
        invalidate(); // Refresh data
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

  return (
    <ErrorBoundary>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MessageList 
            messages={messages}
            selectedMessageId={selectedMessage?.id || null}
            onSelectMessage={handleViewMessage}
            onDeleteMessage={handleDeleteMessage}
            isLoading={isLoading}
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
    </ErrorBoundary>
  );
};

export default ContactsTab;
