
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useQuoteForm } from "@/hooks/useQuoteForm";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { SuccessMessage } from "@/components/quote/SuccessMessage";

type QuoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTitle?: string;
};

export function QuoteDialog({ open, onOpenChange, serviceTitle }: QuoteDialogProps) {
  // Utiliser le hook existant pour la gestion du formulaire
  const {
    formData,
    errors,
    sent,
    loading,
    handleInputChange,
    handleServiceChange,
    handleSubmit,
    resetForm
  } = useQuoteForm(serviceTitle);

  // Réinitialiser le formulaire lorsque la boîte de dialogue se ferme
  useEffect(() => {
    if (!open) {
      // Légère temporisation pour éviter de perturber l'animation de fermeture
      const timer = setTimeout(() => {
        resetForm();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open, resetForm]);

  // Méthode sécurisée pour fermer la boîte de dialogue
  const handleCloseDialog = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        // Empêcher la fermeture de la boîte de dialogue pendant la soumission
        if (!loading && value !== open) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Demander un devis {serviceTitle ? `pour "${serviceTitle}"` : ""}</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour obtenir un devis personnalisé. Nous vous répondrons rapidement.
          </DialogDescription>
        </DialogHeader>
        
        {!sent ? (
          <QuoteForm
            formData={formData}
            errors={errors}
            loading={loading}
            serviceTitle={serviceTitle}
            onInputChange={handleInputChange}
            onServiceChange={handleServiceChange}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        ) : (
          <SuccessMessage onClose={handleCloseDialog} />
        )}
      </DialogContent>
    </Dialog>
  );
}
