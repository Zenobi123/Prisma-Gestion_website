
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/types/blog";
import { updateBlogPostContentByTitle } from "@/services/blog/updateBlogPost";
import { generateFormattedContent } from "@/services/blog/formatBlogContent";

export const useArticleContent = (posts: BlogPost[], loadPosts: () => Promise<void>) => {
  const { toast } = useToast();
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);

  const handleUpdateArticleContent = async (post: BlogPost) => {
    if (!post) return false;

    setIsUpdatingContent(true);
    try {
      console.log("Mise à jour du contenu pour l'article:", post.title);
      
      // Générer le contenu formaté - en conservant le contenu original si c'est déjà du HTML
      const formattedContent = post.content && post.content.includes('<') && post.content.includes('>')
        ? post.content  // Préserver le HTML original
        : generateFormattedContent(post);
      
      // Mettre à jour l'article avec le contenu formaté
      await updateBlogPostContentByTitle(post.title, formattedContent);
      
      // Notifier l'utilisateur
      toast({
        title: "Contenu mis à jour",
        description: "Le contenu de l'article a été mis à jour avec succès."
      });
      
      // Déclencher l'événement de mise à jour
      window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
      
      // Recharger les articles
      await loadPosts();
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contenu de l'article.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdatingContent(false);
    }
  };

  return {
    isUpdatingContent,
    handleUpdateArticleContent
  };
};
