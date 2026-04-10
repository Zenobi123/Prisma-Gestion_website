
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { QuoteRequest } from '@/utils/quotes/types';
import { useToast } from "@/hooks/use-toast";

interface QuoteDetailsProps {
  quote: QuoteRequest | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QuoteDetails = ({ quote, onMarkAsRead, onDelete }: QuoteDetailsProps) => {
  const { toast } = useToast();
  
  const handleDeleteClick = (id: string) => {
    try {
      onDelete(id);
    } catch (error) {
      console.error("Error when attempting to delete:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cette demande de devis.",
        variant: "destructive",
      });
    }
  };
  
  const handleMarkAsReadClick = (id: string) => {
    try {
      onMarkAsRead(id);
      toast({
        title: "Succès",
        description: "Demande marquée comme lue.",
      });
    } catch (error) {
      console.error("Error when marking as read:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer cette demande comme lue.",
        variant: "destructive",
      });
    }
  };

  if (!quote) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Aucun devis sélectionné</p>
          <p className="text-muted-foreground mt-2 max-w-md">
            Sélectionnez une demande de devis dans la liste pour afficher ses détails.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold">{quote.full_name}</h3>
            <p className="text-gray-500">{quote.email} | {quote.phone}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => handleDeleteClick(quote.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
            {!quote.read && (
              <Button
                variant="outline"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => handleMarkAsReadClick(quote.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme lu
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Service demandé</h4>
          <p className="p-3 bg-gray-50 rounded-md">
            {quote.service || "Aucun service spécifié"}
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Détails de la demande</h4>
          <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
            {quote.details}
          </div>
        </div>

        <div className="border-t pt-4 text-sm text-gray-500">
          Demande reçue le {new Date(quote.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </CardContent>
    </Card>
  );
};
