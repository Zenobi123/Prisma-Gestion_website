
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageUploader from "../../blog/form/ImageUploader";
import { Loader2 } from "lucide-react";
import { ServiceType } from "@/types/services";

interface EditServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: ServiceType) => Promise<void>;
  isSubmitting: boolean;
  service: ServiceType | null;
  onServiceChange: (service: ServiceType) => void;
}

export const EditServiceDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isSubmitting, 
  service, 
  onServiceChange 
}: EditServiceDialogProps) => {
  if (!service) return null;

  const handleServiceItemChange = (index: number, value: string) => {
    const updatedItems = [...service.items];
    updatedItems[index] = value;
    
    if (index === updatedItems.length - 1 && value.trim() !== "") {
      updatedItems.push("");
    }
    
    onServiceChange({...service, items: updatedItems});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le service</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de ce service.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="grid gap-4 py-4 px-1">
            <div>
              <Label htmlFor="edit-title">Titre</Label>
              <Input
                id="edit-title"
                value={service.title}
                onChange={(e) => onServiceChange({ ...service, title: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-id">Identifiant</Label>
              <Input
                id="edit-id"
                value={service.id}
                className="mt-1"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                L'identifiant ne peut pas être modifié
              </p>
            </div>
            
            <ImageUploader
              initialImage={service.image || "/placeholder.svg"}
              idPrefix={`edit-service-${service.id}`}
              onImageChange={(imageUrl) => onServiceChange({ ...service, image: imageUrl })}
            />
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={service.description}
                onChange={(e) => onServiceChange({ ...service, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Points clés du service</Label>
              <div className="space-y-2 mt-1">
                {service.items.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => handleServiceItemChange(index, e.target.value)}
                    placeholder={`Point clé ${index + 1}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Les champs vides ne seront pas affichés
              </p>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            className="bg-[#2E1A47] hover:bg-[#2E1A47]/90" 
            onClick={() => onSubmit(service)}
            disabled={isSubmitting || !service.title.trim() || !service.description.trim()}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
