
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "../blog/form/ImageUploader";
import { updateSectionContent, getSectionContent, AboutSectionContent } from "@/utils/siteSections";
import aboutImage from "@/assets/about-prisma.jpg";

const AboutTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutSectionContent>({
    title: "À propos de PRISMA GESTION",
    paragraph1: "Fondé à Yaoundé au Cameroun, PRISMA GESTION est un cabinet de conseil pluridisciplinaire offrant des services à haute valeur ajoutée aux entreprises et organisations de toutes tailles.",
    paragraph2: "Notre approche intégrée combinant expertise traditionnelle et solutions digitales innovantes nous permet de répondre efficacement aux défis complexes de nos clients.",
    advantages: [
      "Plus de 10 ans d'expérience",
      "Équipe pluridisciplinaire",
      "Approche personnalisée",
      "Expertise locale et internationale",
    ],
    buttonText: "Découvrir nos services",
    buttonLink: "#services",
    image: aboutImage
  });
  
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    getSectionContent<AboutSectionContent>('about').then((content) => {
      if (content && mounted) {
        setAboutData(content);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la section à propos",
        variant: "destructive",
      });
    });
    
    return () => { mounted = false; };
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData({
      ...aboutData,
      [name]: value
    });
  };

  const handleAdvantageChange = (index: number, value: string) => {
    const newAdvantages = [...aboutData.advantages];
    newAdvantages[index] = value;
    
    setAboutData({
      ...aboutData,
      advantages: newAdvantages
    });
  };

  const handleAddAdvantage = () => {
    setAboutData({
      ...aboutData,
      advantages: [...aboutData.advantages, ""]
    });
  };

  const handleRemoveAdvantage = (index: number) => {
    const newAdvantages = [...aboutData.advantages];
    newAdvantages.splice(index, 1);
    
    setAboutData({
      ...aboutData,
      advantages: newAdvantages
    });
  };

  const handleImageChange = (imageUrl: string) => {
    setAboutData({
      ...aboutData,
      image: imageUrl
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateSectionContent('about', aboutData);
      toast({
        title: "Modifications enregistrées",
        description: "Les changements de la section 'À propos' ont été sauvegardés.",
      });
      // Trigger an event to notify other components to update
      window.dispatchEvent(new Event('home-content-update'));
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
      <h3 className="text-xl font-medium text-[#2E1A47]">Section 'À propos'</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <Input
            id="title"
            name="title"
            value={aboutData.title}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="paragraph1" className="block text-sm font-medium text-gray-700 mb-1">
            Premier paragraphe
          </label>
          <Textarea
            id="paragraph1"
            name="paragraph1"
            value={aboutData.paragraph1}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="paragraph2" className="block text-sm font-medium text-gray-700 mb-1">
            Deuxième paragraphe
          </label>
          <Textarea
            id="paragraph2"
            name="paragraph2"
            value={aboutData.paragraph2}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avantages
          </label>
          
          {aboutData.advantages.map((advantage, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                value={advantage}
                onChange={(e) => handleAdvantageChange(index, e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              {aboutData.advantages.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAdvantage(index)}
                  className="ml-2 text-red-500"
                  disabled={isLoading}
                >
                  Supprimer
                </Button>
              )}
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAdvantage}
            className="mt-2"
            disabled={isLoading}
          >
            Ajouter un avantage
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
              Texte du bouton
            </label>
            <Input
              id="buttonText"
              name="buttonText"
              value={aboutData.buttonText}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700 mb-1">
              Lien du bouton
            </label>
            <Input
              id="buttonLink"
              name="buttonLink"
              value={aboutData.buttonLink}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <ImageUploader
            initialImage={aboutData.image}
            idPrefix="about-section"
            onImageChange={handleImageChange}
            disabled={isLoading}
          />
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

export default AboutTab;
