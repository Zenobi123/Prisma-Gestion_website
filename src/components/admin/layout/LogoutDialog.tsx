
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmLogout: (goToHome?: boolean) => void;
}

export const LogoutDialog = ({ open, onOpenChange, confirmLogout }: LogoutDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-center">Déconnexion</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            Vous êtes sur le point de vous déconnecter de l'interface d'administration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <AlertDialogCancel className="w-full">Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => confirmLogout(false)}
            className="w-full bg-[#2E1A47] hover:bg-[#2E1A47]/90"
          >
            Se déconnecter
          </AlertDialogAction>
          <Button 
            onClick={() => confirmLogout(true)}
            className="w-full bg-prisma-chartreuse text-prisma-purple hover:bg-prisma-chartreuse/90"
          >
            Se déconnecter et retourner au site
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
