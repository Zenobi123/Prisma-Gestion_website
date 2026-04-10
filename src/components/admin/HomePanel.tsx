
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import HeroTab from "./home/HeroTab";
import AboutTab from "./home/AboutTab";
import ServicesTab from "./home/ServicesTab";
import ContactTab from "./home/ContactTab";

const HomePanel = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const { toast } = useToast();

  // Écouter les mises à jour des contenus et afficher un toast de confirmation
  useEffect(() => {
    const handleContentUpdate = (e: CustomEvent) => {
      const { section, content } = e.detail || {};
      if (section) {
        console.log(`HomePanel: Mise à jour de la section ${section} détectée`, content);
        toast({
          title: "Section mise à jour",
          description: `Les modifications de la section ${section === 'hero' ? 'd\'entête' : section} ont été appliquées.`,
        });
      }
    };

    window.addEventListener('home-content-update', handleContentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('home-content-update', handleContentUpdate as EventListener);
    };
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#2E1A47]">Gestion de la page d'accueil</h2>
        <p className="text-gray-500">Modifiez les différentes sections de votre page d'accueil</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Entête (Hero)</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="p-4 bg-white rounded-lg shadow">
          <HeroTab />
        </TabsContent>
        
        <TabsContent value="about" className="p-4 bg-white rounded-lg shadow">
          <AboutTab />
        </TabsContent>
        
        <TabsContent value="services" className="p-4 bg-white rounded-lg shadow">
          <ServicesTab />
        </TabsContent>
        
        <TabsContent value="contact" className="p-4 bg-white rounded-lg shadow">
          <ContactTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePanel;
