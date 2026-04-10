
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateSectionContent, getSectionContent, HeroSectionContent } from "@/utils/siteSections";

const HeroTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<HeroSectionContent>({
    title: "Votre partenaire en expertise comptable et numérique",
    description: "PRISMA GESTION vous accompagne dans vos projets avec des solutions sur-mesure en comptabilité, finance, fiscalité, RH, et transformation digitale.",
    buttonText: "Découvrir nos services",
    buttonLink: "#services",
    secondaryButtonText: "Prendre Rendez-vous",
    secondaryButtonLink: "/rendez-vous"
  });
  
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    getSectionContent<HeroSectionContent>('hero')
      .then((content) => {
        if (content && mounted) {
          setHeroData(content);
        }
        if (mounted) setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement de la section Hero:", error);
        if (mounted) setIsLoading(false);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de la section héro",
          variant: "destructive",
        });
      });
    
    return () => { mounted = false; };
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSectionContent('hero', heroData);
      toast({
        title: "Modifications enregistrées",
        description: "Les changements de la section d'entête ont été sauvegardés.",
      });
      
      // Dispatch de l'événement avec les nouvelles données pour mise à jour immédiate
      const updateEvent = new CustomEvent('home-content-update', {
        detail: { section: 'hero', content: heroData }
      });
      window.dispatchEvent(updateEvent);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-[#2E1A47]">Section d'entête (Hero)</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <Input
            id="title"
            name="title"
            value={heroData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={heroData.description}
            onChange={handleChange}
            rows={4}
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
              Texte du bouton principal
            </label>
            <Input
              id="buttonText"
              name="buttonText"
              value={heroData.buttonText}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700 mb-1">
              Lien du bouton principal
            </label>
            <Input
              id="buttonLink"
              name="buttonLink"
              value={heroData.buttonLink}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="secondaryButtonText" className="block text-sm font-medium text-gray-700 mb-1">
              Texte du bouton secondaire
            </label>
            <Input
              id="secondaryButtonText"
              name="secondaryButtonText"
              value={heroData.secondaryButtonText}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="secondaryButtonLink" className="block text-sm font-medium text-gray-700 mb-1">
              Lien du bouton secondaire
            </label>
            <Input
              id="secondaryButtonLink"
              name="secondaryButtonLink"
              value={heroData.secondaryButtonLink}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          className="bg-[#2E1A47] hover:bg-[#2E1A47]/90"
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default HeroTab;
