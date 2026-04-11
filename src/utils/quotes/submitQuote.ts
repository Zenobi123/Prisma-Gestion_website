import { supabase } from '@/integrations/supabase/client';
import { QuoteRequest } from './types';
import { sendQuoteEmail } from '@/utils/email/sendEmail';

// Soumettre une nouvelle demande de devis
export const submitQuote = async (formData: {
  full_name: string;
  email: string;
  phone: string;
  details: string;
  service: string | null;
}): Promise<{ id?: string; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        details: formData.details,
        service: formData.service,
        read: false,
        status: 'new'
      })
      .select();

    if (error) {
      // Supabase désactivé : envoi par email directement
      if ((error as { code?: string }).code === 'SUPABASE_DISABLED') {
        console.log('Supabase désactivé – envoi de la demande de devis par email.');
        await sendQuoteEmail(formData);
        return { id: `quote-${Date.now()}` };
      }
      console.error('Erreur lors de la soumission de la demande de devis:', error);
      return { error };
    }

    return { id: data?.[0]?.id };
  } catch (error) {
    console.error('Erreur lors de la soumission de la demande de devis:', error);
    return { error };
  }
};

// Alias the function for backward compatibility
export const submitQuoteRequest = submitQuote;
