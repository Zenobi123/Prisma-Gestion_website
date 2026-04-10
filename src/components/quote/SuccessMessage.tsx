
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  onClose: () => void;
}

export function SuccessMessage({ onClose }: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center space-y-3 py-4">
      <CheckCircle2 className="text-green-500 w-12 h-12 mb-2" />
      <p className="font-semibold text-lg">Demande envoyée !</p>
      <p className="text-muted-foreground text-sm text-center">
        Merci pour votre demande.<br />Nous reviendrons vers vous rapidement.
      </p>
      <button 
        className="btn-primary px-4 py-2 rounded mt-2 bg-prisma-purple text-white hover:bg-prisma-purple/90 transition-colors"
        onClick={onClose}
      >
        Fermer
      </button>
    </div>
  );
}
