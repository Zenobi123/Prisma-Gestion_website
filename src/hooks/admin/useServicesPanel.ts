
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceType } from "@/types/services";
import { getServiceImage } from "@/utils/serviceImages";
import { useToast } from "@/hooks/use-toast";

const defaultServices: ServiceType[] = [
  {
    id: 'accounting',
    title: 'Comptabilité',
    description: 'Services complets de tenue comptable et reporting financier pour assurer la conformité et la clarté de vos opérations financières.',
    items: ['Tenue comptable', 'Révision comptable', 'Reporting financier', 'États financiers'],
    image: getServiceImage('accounting')
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Conseil stratégique et gestion de trésorerie pour optimiser les ressources financières de votre entreprise et sécuriser sa croissance.',
    items: ['Gestion de trésorerie', 'Budgétisation', 'Analyse financière', 'Financement'],
    image: getServiceImage('finance')
  },
  {
    id: 'tax',
    title: 'Fiscalité',
    description: 'Optimisation fiscale et conformité pour minimiser votre charge fiscale tout en respectant les obligations légales et réglementaires.',
    items: ['Déclarations fiscales', 'Optimisation fiscale', 'Conseils TVA', 'Contrôle fiscal'],
    image: getServiceImage('tax')
  },
  {
    id: 'hr',
    title: 'Ressources Humaines',
    description: 'Gestion administrative du personnel, recrutement, formation et développement des compétences pour valoriser votre capital humain.',
    items: ['Paie et administration', 'Recrutement', 'Formation', 'Conseils RH'],
    image: getServiceImage('hr')
  }
];

export const useServicesPanel = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Erreur lors du chargement des services:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les services. Veuillez réessayer.",
          variant: "destructive",
        });
        setServices(defaultServices);
      } else if (data && data.length > 0) {
        console.log('Services chargés depuis Supabase:', data.length);
        const dataWithImages = data.map(s => ({
          ...s,
          image: s.image && s.image !== '/placeholder.svg' ? s.image : getServiceImage(s.id)
        }));
        setServices(dataWithImages);
      } else {
        console.log('Aucun service trouvé dans Supabase, utilisation des services par défaut');
        setServices(defaultServices);
      }
    } catch (err) {
      console.error('Exception lors du chargement des services:', err);
      setServices(defaultServices);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = async (newService: ServiceType) => {
    setIsSubmitting(true);
    const id = newService.id || newService.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    const items = newService.items.filter(item => item.trim() !== "");
    
    const serviceToAdd = {
      ...newService,
      id,
      items
    };

    try {
      const { error } = await supabase
        .from('services')
        .insert(serviceToAdd)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Service ajouté",
        description: `Le service "${newService.title}" a été ajouté avec succès.`,
      });

      window.dispatchEvent(new CustomEvent('home-content-update', {
        detail: { 
          section: 'services',
          timestamp: new Date().getTime() 
        }
      }));
      
      setIsAddDialogOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Exception lors de l\'ajout du service:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du service.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = async (updatedService: ServiceType) => {
    setIsSubmitting(true);
    
    try {
      const items = updatedService.items.filter(item => item.trim() !== "");
      
      const serviceToUpdate = {
        ...updatedService,
        items
      };

      const { error } = await supabase
        .from('services')
        .update(serviceToUpdate)
        .eq('id', updatedService.id);

      if (error) throw error;

      toast({
        title: "Service modifié",
        description: `Le service "${updatedService.title}" a été modifié avec succès.`,
      });

      window.dispatchEvent(new CustomEvent('home-content-update', {
        detail: { 
          section: 'services',
          timestamp: new Date().getTime(),
          forceRefresh: true
        }
      }));
      
      setIsEditDialogOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Exception lors de la modification du service:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la modification du service.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', selectedService.id);

      if (error) throw error;

      toast({
        title: "Service supprimé",
        description: `Le service "${selectedService.title}" a été supprimé avec succès.`,
      });

      window.dispatchEvent(new CustomEvent('home-content-update', {
        detail: { 
          section: 'services',
          timestamp: new Date().getTime() 
        }
      }));
      
      setIsDeleteDialogOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Exception lors de la suppression du service:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression du service.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitializeServices = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .insert(defaultServices);

      if (error) throw error;

      toast({
        title: "Services initialisés",
        description: "Les services par défaut ont été ajoutés avec succès.",
      });

      window.dispatchEvent(new CustomEvent('home-content-update', {
        detail: { 
          section: 'services',
          timestamp: new Date().getTime() 
        }
      }));
      
      fetchServices();
    } catch (err) {
      console.error('Exception lors de l\'initialisation des services:', err);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'initialisation des services.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
