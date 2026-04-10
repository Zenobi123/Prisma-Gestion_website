
import { FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuoteRequest } from '@/utils/quotes/types';

interface QuotesListProps {
  quotes: QuoteRequest[];
  selectedQuote: QuoteRequest | null;
  onViewQuote: (quote: QuoteRequest) => void;
}

export const QuotesList = ({ quotes, selectedQuote, onViewQuote }: QuotesListProps) => {
  if (quotes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium">Aucun devis</p>
          <p className="text-muted-foreground mt-2 text-center max-w-md">
            Aucune demande de devis n'a été reçue pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = quotes.filter(quote => !quote.read).length;

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Demandes de devis
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-[#D6DD00] text-[#2E1A47]">
                {unreadCount} {unreadCount === 1 ? 'nouveau' : 'nouveaux'}
              </Badge>
            )}
          </h3>
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedQuote?.id === quote.id
                  ? 'bg-[#2E1A47]/10'
                  : 'hover:bg-gray-100'
              } ${!quote.read ? 'border-l-4 border-[#D6DD00]' : ''}`}
              onClick={() => onViewQuote(quote)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{quote.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {quote.service || "Pas de service spécifié"}
                  </p>
                </div>
                {!quote.read && (
                  <Badge variant="outline" className="bg-[#D6DD00]/10 text-[#2E1A47] border-[#D6DD00]">
                    Nouveau
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(quote.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
