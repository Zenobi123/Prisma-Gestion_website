
import { useState } from 'react';
import { QuoteRequest } from '@/utils/quotes/types';

export const useQuotesState = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  return {
    quotes,
    setQuotes,
    loading,
    setLoading,
    selectedQuote,
    setSelectedQuote,
    showDeleteDialog,
    setShowDeleteDialog,
    quoteToDelete,
    setQuoteToDelete
  };
};
