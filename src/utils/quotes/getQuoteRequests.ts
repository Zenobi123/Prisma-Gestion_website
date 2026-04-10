
import { supabase } from '@/integrations/supabase/client';
import { QuoteRequest } from './types';

// Fetch all quote requests
export const getQuoteRequests = async (): Promise<QuoteRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return [];
  }
};

// Delete a quote request
export const deleteQuoteRequest = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting quote request:', error);
    throw error;
  }
};
