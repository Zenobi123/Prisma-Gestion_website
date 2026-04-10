
import { supabase } from '@/integrations/supabase/client';
import { QuoteRequest } from '@/utils/quotes/types';
import { triggerQuoteRequestsUpdated } from '@/utils/quotes/events';
import { useToast } from '@/hooks/use-toast';

export const useQuotesEvents = () => {
  const { toast } = useToast();

  // Marquer une demande comme lue
  const markQuoteAsRead = async (quote: QuoteRequest): Promise<boolean> => {
    try {
      if (!quote.id) return false;

      const { data, error } = await supabase
        .from('quote_requests')
        .update({ read: true })
        .eq('id', quote.id)
        .select();

      if (error) throw error;
      
      // Déclencher l'événement personnalisé après la mise à jour
      triggerQuoteRequestsUpdated(data);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de la demande comme lue:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la demande.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    markQuoteAsRead
  };
};
