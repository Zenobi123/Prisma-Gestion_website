
import { useState, useCallback } from 'react';
import { useQuotesState } from './useQuotesState';
import { useQuotesData } from './useQuotesData';
import { useQuotesEvents } from './useQuotesEvents';
import { QuoteRequest } from '@/utils/quotes/types';

export const useQuotesTab = () => {
  // Get state management hooks
  const {
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
  } = useQuotesState();

  // Set up data operations with memoized callbacks
  const {
    fetchQuotes,
    handleMarkAsRead,
    confirmDelete
  } = useQuotesData(
    setQuotes,
    setLoading,
    quotes,
    selectedQuote,
    setSelectedQuote
  );

  // Set up event handlers
  const { markQuoteAsRead } = useQuotesEvents();

  // Handle viewing a quote (select it and mark as read)
  const handleViewQuote = useCallback((quote: QuoteRequest) => {
    // Only mark as unread if not already read
    if (!quote.read) {
      markQuoteAsRead(quote);
    }
    setSelectedQuote(quote);
  }, [markQuoteAsRead, setSelectedQuote]);

  // Handle quote deletion
  const handleDeleteQuote = useCallback(async (id: string) => {
    setQuoteToDelete(id);
    setShowDeleteDialog(true);
    return id;
  }, [setQuoteToDelete, setShowDeleteDialog]);

  // Process delete confirmation
  const processConfirmDelete = useCallback(() => {
    if (quoteToDelete) {
      confirmDelete(quoteToDelete);
    }
    // Nettoyage de l'état du dialogue
    setShowDeleteDialog(false);
    setQuoteToDelete(null);
  }, [quoteToDelete, confirmDelete, setShowDeleteDialog, setQuoteToDelete]);

  return {
    // State
    quotes,
    loading,
    selectedQuote,
    showDeleteDialog,
    setShowDeleteDialog,
    
    // Actions
    handleMarkAsRead,
    handleDelete: handleDeleteQuote,
    handleViewQuote,
    confirmDelete: processConfirmDelete
  };
};
