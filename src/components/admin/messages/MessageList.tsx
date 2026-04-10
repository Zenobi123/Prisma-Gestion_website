
import { useState } from 'react';
import { Mail, Trash2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContactMessage } from '@/utils/contact/types';

interface MessageListProps {
  messages: ContactMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (message: ContactMessage) => void;
  onDeleteMessage: (id: string) => void;
  isLoading?: boolean;
}

const MessageList = ({ 
  messages, 
  selectedMessageId, 
  onSelectMessage, 
  onDeleteMessage,
  isLoading = false
}: MessageListProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Date invalide:', dateString, error);
      return 'Date inconnue';
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Messages reçus</CardTitle>
        <CardDescription>
          {messages.length} {messages.length === 1 ? 'message' : 'messages'} au total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-prisma-purple mb-2" />
              <p className="text-sm text-muted-foreground">Chargement des messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun message reçu</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => onSelectMessage(message)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMessageId === message.id
                      ? 'bg-muted border-prisma-purple'
                      : message.read
                      ? 'hover:bg-muted'
                      : 'bg-prisma-purple/5 hover:bg-prisma-purple/10 border-prisma-purple/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium flex items-center gap-2">
                      {!message.read && <div className="w-2 h-2 bg-prisma-purple rounded-full" />}
                      {message.firstName} {message.lastName}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMessage(message.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {message.subject || "(Sans objet)"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(message.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MessageList;
