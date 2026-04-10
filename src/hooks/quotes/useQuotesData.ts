import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteRequest } from '@/utils/quotes/types';

export const useQuotesData = (
  setQuotes: (quotes: QuoteRequest[]) => void,
  setLoading: (loading: boolean) => void,
  quotes: QuoteRequest[],
  selectedQuote: QuoteRequest | null,
  setSelectedQuote: (quote: QuoteRequest | null) => void
) => {
  // Fetch quotes from server
  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quotes:', error);
        return;
      }

      setQuotes(data as QuoteRequest[]);
    } catch (err) {
      console.error('Error in fetchQuotes:', err);
    } finally {
      setLoading(false);
    }
  }, [setQuotes, setLoading]);

  // Mark quote as read in the database
  const handleMarkAsRead = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking quote as read:', error);
        return;
      }

      // Update local state
      setQuotes(quotes.map(quote => {
        if (quote.id === id) {
          return { ...quote, read: true };
        }
        return quote;
      }));

      // Update selectedQuote if it's the one being marked
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote({ ...selectedQuote, read: true });
      }
    } catch (err) {
      console.error('Error in handleMarkAsRead:', err);
    }
  };

  // Handle quote deletion in database
  const confirmDelete = async (quoteId: string | null): Promise<void> => {
    if (!quoteId) return;
    
    console.log("Confirming deletion for ID:", quoteId);
    
    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', quoteId);

      if (error) {
        console.error('Error deleting quote:', error);
        return;
      }

      console.log("Quote deleted successfully from database:", quoteId);
      
      // Local state updates will be handled by useQuotesEvents
    } catch (err) {
      console.error('Error in confirmDelete:', err);
    }
  };

  return {
    fetchQuotes,
    handleMarkAsRead,
    confirmDelete
  };
};
