
import { Card, CardContent } from "@/components/ui/card";
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useQuotesTab } from '@/hooks/quotes/useQuotesTab';
import { QuotesList } from './quotes/QuotesList';
import { QuoteDetails } from './quotes/QuoteDetails';

const QuotesTab = () => {
  const {
    quotes,
    loading,
    selectedQuote,
    showDeleteDialog,
    setShowDeleteDialog,
    handleMarkAsRead,
    handleDelete,
    handleViewQuote,
    confirmDelete
  } = useQuotesTab();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2E1A47] mr-2"></div>
          <span>Chargement des demandes de devis...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <QuotesList
          quotes={quotes}
          selectedQuote={selectedQuote}
          onViewQuote={handleViewQuote}
        />
      </div>

      <div className="md:col-span-2">
        <QuoteDetails
          quote={selectedQuote}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default QuotesTab;
