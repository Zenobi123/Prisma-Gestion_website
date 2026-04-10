
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Image } from "lucide-react";
import { useServicesPanel } from "@/hooks/admin/useServicesPanel";
import { AddServiceDialog } from "./services/dialogs/AddServiceDialog";
import { EditServiceDialog } from "./services/dialogs/EditServiceDialog";
import { DeleteServiceDialog } from "./services/dialogs/DeleteServiceDialog";
import { ServicesTable } from "./services/ServicesTable";

const ServicesPanel = () => {
  const {
    services,
    isLoading,
    isSubmitting,
    selectedService,
    setSelectedService,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    fetchServices,
    handleAddService,
    handleEditService,
    handleDeleteService,
    handleInitializeServices
  } = useServicesPanel();

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#2E1A47]">Gestion des services</h2>
          <p className="text-gray-500">Ajoutez, modifiez ou supprimez les services que vous proposez</p>
        </div>
        <div className="space-x-2">
          {services.length === 0 && !isLoading && (
            <Button 
              onClick={handleInitializeServices}
              variant="outline"
              className="border-[#2E1A47] text-[#2E1A47]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Initialiser les services par défaut
            </Button>
          )}
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#2E1A47] hover:bg-[#2E1A47]/90"
            disabled={isSubmitting}
          >
            <PlusCircle size={16} className="mr-2" />
            Ajouter un service
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#2E1A47]" />
            <span className="ml-2">Chargement des services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center p-8">
            <div className="mb-4">
              <Image className="h-12 w-12 mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun service disponible</h3>
            <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de services.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[#2E1A47] hover:bg-[#2E1A47]/90"
              disabled={isSubmitting}
            >
              <PlusCircle size={16} className="mr-2" />
              Ajouter un service
            </Button>
          </div>
        ) : (
          <ServicesTable 
            services={services}
            onEdit={(service) => {
              setSelectedService(service);
              setIsEditDialogOpen(true);
            }}
            onDelete={(service) => {
              setSelectedService(service);
              setIsDeleteDialogOpen(true);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <AddServiceDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddService}
        isSubmitting={isSubmitting}
      />

      <EditServiceDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditService}
        isSubmitting={isSubmitting}
        service={selectedService}
        onServiceChange={setSelectedService}
      />

      <DeleteServiceDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteService}
        isSubmitting={isSubmitting}
        service={selectedService}
      />
    </div>
  );
};

export default ServicesPanel;
