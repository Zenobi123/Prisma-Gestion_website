
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPost, NewBlogPost } from "@/types/blog";

// Import des tabs
import ContentTab from "./form/ContentTab";
import SettingsTab from "./form/SettingsTab";
import SEOTab from "./form/SEOTab";

// Fonction utilitaire pour n'extraire que le contenu du <body> si on colle un HTML complet
function extractBodyContentIfHtmlDocument(html: string): string {
  if (!html) return "";
  // Regarde s'il y a une balise <body>, si oui extrait juste le contenu de body
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (match) {
    return match[1];
  }
  // Sinon, retourne le HTML tel quel
  return html;
}

interface BlogPostFormProps {
  post: BlogPost | NewBlogPost;
  isNewPost?: boolean;
  onValueChange: (post: BlogPost | NewBlogPost) => void;
}

const BlogPostForm = ({ post, isNewPost = false, onValueChange }: BlogPostFormProps) => {
  const [activeTab, setActiveTab] = useState("content");
  const idPrefix = isNewPost ? "new" : "edit";

  // Ajout d'une gestion spéciale du collage HTML dans le champ content
  const handleContentPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Si l'utilisateur colle du HTML, on capture la version HTML
    if (e.clipboardData.types.includes("text/html")) {
      e.preventDefault();
      const html = e.clipboardData.getData("text/html");
      // Extraire uniquement la partie "pertinente" (le contenu du body s'il y en a)
      const mainHtml = extractBodyContentIfHtmlDocument(html);
      onValueChange({ ...post, content: mainHtml });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="content">Contenu</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <ContentTab 
          post={post} 
          idPrefix={idPrefix} 
          onValueChange={onValueChange}
          // On transmet le handler de collage spécial pour l'édition du contenu
          onContentPaste={handleContentPaste}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <SettingsTab 
          post={post} 
          idPrefix={idPrefix} 
          onValueChange={onValueChange} 
        />
      </TabsContent>
      
      <TabsContent value="seo">
        <SEOTab 
          post={post} 
          idPrefix={idPrefix} 
          onValueChange={onValueChange} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default BlogPostForm;

