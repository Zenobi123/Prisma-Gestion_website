
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageUploader from "../../blog/form/ImageUploader";
import { Loader2 } from "lucide-react";
import { ServiceType } from "@/types/services";

interface AddServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (service: ServiceType) => Promise<void>;
  isSubmitting: boolean;
}

export const AddServiceDialog = ({ isOpen, onOpenChange, onSubmit, isSubmitting }: AddServiceDialogProps) => {
  const [newService, setNewService] = useState<ServiceType>({
    id: "",
    title: "",
    description: "",
    items: ["", "", "", ""],
    image: "/placeholder.svg"
  });

  const handleServiceItemChange = (index: number, value: string) => {
    const updatedItems = [...newService.items];
    updatedItems[index] = value;
    
    if (index === updatedItems.length - 1 && value.trim() !== "") {
      updatedItems.push("");
    }
    
    setNewService({...newService, items: updatedItems});
  };

  const handleSubmit = async () => {
    await onSubmit(newService);
    setNewService({
      id: "",
      title: "",
      description: "",
      items: ["", "", "", ""],
      image: "/placeholder.svg"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau service</DialogTitle>
          <DialogDescription>
            Créez un nouveau service à afficher sur votre site.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="grid gap-4 py-4 px-1">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="id">Identifiant (optionnel)</Label>
              <Input
                id="id"
                value={newService.id}
                onChange={(e) => setNewService({ ...newService, id: e.target.value.toLowerCase().replace(/[^\w-]/g, '') })}
                className="mt-1"
                placeholder="identifiant-technique"
              />
              <p className="text-xs text-gray-500 mt-1">
                Laissez vide pour générer automatiquement à partir du titre
              </p>
            </div>
            
            <ImageUploader
              initialImage={newService.image || "/placeholder.svg"}
              idPrefix="new-service"
              onImageChange={(imageUrl) => setNewService({ ...newService, image: imageUrl })}
            />
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Points clés du service</Label>
              <div className="space-y-2 mt-1">
                {newService.items.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => handleServiceItemChange(index, e.target.value)}
                    placeholder={`Point clé ${index + 1}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez autant de points que nécessaire
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
            onClick={handleSubmit}
            disabled={isSubmitting || !newService.title.trim() || !newService.description.trim()}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
