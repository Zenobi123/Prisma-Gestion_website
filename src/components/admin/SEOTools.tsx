
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Globe, BarChart3 } from "lucide-react";
import { SitemapService } from "@/services/sitemapService";
import { AnalyticsService } from "@/services/analyticsService";
import { useToast } from "@/hooks/use-toast";

const SEOTools = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      await SitemapService.downloadSitemap();
      toast({
        title: "Sitemap généré",
        description: "Le fichier sitemap.xml a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la génération du sitemap:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du sitemap.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const trackTestEvent = () => {
    AnalyticsService.trackEvent({
      event: 'test_event',
      category: 'admin',
      action: 'test_analytics',
      label: 'admin_panel'
    });
    toast({
      title: "Événement de test envoyé",
      description: "Un événement de test a été envoyé aux analytics.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-prisma-purple">Outils SEO</h2>
        <p className="text-gray-500">Gérez le référencement et les analytics de votre site</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Sitemap XML
            </CardTitle>
            <CardDescription>
              Générez automatiquement un sitemap XML avec toutes vos pages et articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerateSitemap}
              disabled={isGenerating}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Génération..." : "Télécharger le sitemap"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
            </CardTitle>
            <CardDescription>
              Testez le suivi des événements analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={trackTestEvent}
              variant="outline"
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              Tester les analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Structured Data</CardTitle>
          <CardDescription>
            Les données structurées sont automatiquement générées pour améliorer le référencement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Organisation Schema.org ✓</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Articles Schema.org ✓</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Open Graph tags ✓</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>Twitter Cards ✓</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOTools;
