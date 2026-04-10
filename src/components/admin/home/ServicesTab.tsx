
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ServicesTab = () => {
  const { toast } = useToast();

  const handleRedirectToServices = () => {
    // Navigue vers le panneau des services via le state
    document.dispatchEvent(new CustomEvent('admin-navigate', { detail: 'services' }));
    
    // Déclencher l'événement de mise à jour pour rafraîchir les services
    window.dispatchEvent(new CustomEvent('home-content-update', {
      detail: { 
        section: 'services',
        timestamp: new Date().getTime() 
      }
    }));
    
    toast({
      title: "Navigation",
      description: "Redirection vers le panneau de gestion des services...",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 text-amber-800 p-4 rounded-md border border-amber-200 flex items-start">
        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium mb-1">Gestion complète des services</h4>
          <p className="text-sm">
            Pour gérer les services affichés sur la page d'accueil, veuillez utiliser le panneau 
            dédié "Services" disponible dans le menu principal de l'administration.
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div className="text-center py-4">
        <h3 className="text-xl font-medium text-[#2E1A47] mb-4">Accéder au panneau de gestion des services</h3>
        <Button 
          onClick={handleRedirectToServices} 
          className="bg-[#2E1A47] hover:bg-[#2E1A47]/90"
        >
          Gérer les services
        </Button>
      </div>
    </div>
  );
};

export default ServicesTab;
