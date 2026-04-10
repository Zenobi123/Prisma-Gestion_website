
import { Eye, EyeOff, Trash2, Mail, Phone, User, AtSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactMessage } from '@/utils/contact/types';

interface MessageDetailProps {
  message: ContactMessage | null;
  onDeleteMessage: (id: string) => void;
}

const MessageDetail = ({ message, onDeleteMessage }: MessageDetailProps) => {
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
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Détails du message</CardTitle>
      </CardHeader>
      <CardContent>
        {message ? (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">
                {message.subject || "(Sans objet)"}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={message.read ? "outline" : "default"}>
                  {message.read ? (
                    <><EyeOff className="mr-1 h-3 w-3" /> Lu</>
                  ) : (
                    <><Eye className="mr-1 h-3 w-3" /> Non lu</>
                  )}
                </Badge>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeleteMessage(message.id)}
                  className="h-8"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium text-foreground">
                  {message.firstName} {message.lastName}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <AtSign className="mr-2 h-4 w-4" />
                <span className="font-medium text-foreground">{message.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                <span className="font-medium text-foreground">{message.whatsapp}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Date: <span className="font-medium text-foreground">{formatDate(message.date)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-2">Message:</h4>
              <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
                {message.message}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center">
            <Mail className="w-16 h-16 mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-medium mb-2">Aucun message sélectionné</h3>
            <p className="text-muted-foreground">
              Cliquez sur un message dans la liste pour afficher son contenu.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageDetail;
