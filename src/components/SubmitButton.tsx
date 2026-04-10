
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  submitSuccess?: boolean;
  text?: string;
  loadingText?: string;
  successText?: string;
  onClick?: () => void;
}

const SubmitButton = ({ 
  isSubmitting, 
  submitSuccess = false,
  text = "Confirmer le rendez-vous", 
  loadingText = "Envoi en cours...",
  successText = "Envoi réussi !",
  onClick
}: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full btn-primary text-base flex justify-center items-center bg-prisma-purple hover:bg-prisma-purple/90"
      disabled={isSubmitting || submitSuccess}
      onClick={onClick}
    >
      {isSubmitting ? (
        <>
          <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
          {loadingText}
        </>
      ) : submitSuccess ? (
        <>
          <CheckCircle className="h-5 w-5 mr-2" />
          {successText}
        </>
      ) : (
        text
      )}
    </Button>
  );
};

export default SubmitButton;
