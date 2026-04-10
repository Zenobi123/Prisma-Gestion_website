
// On utilise désormais la fonction et la table côté Supabase
import { supabase } from "@/integrations/supabase/client";

/**
 * Met à jour l'image associée à un pattern de titre dans la table centrale blog_image_mappings.
 */
export const updateBlogPostImage = async (titleFragment: string, newImageUrl: string): Promise<void> => {
  console.log(`Mise à jour centrale d'image pour le pattern "${titleFragment}" -> ${newImageUrl}`);
  const { error } = await supabase
    .from('blog_image_mappings')
    .upsert({ 
      title_pattern: titleFragment, 
      image_path: newImageUrl 
    }, { onConflict: "title_pattern" });

  if (error) {
    console.error("Erreur lors de la mise à jour de l'image centrale:", error);
    throw error;
  }

  // Notifier le front (rechargement automatique via triggers déjà en place)
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
};

export const getDefaultImageForTitle = async (title: string): Promise<string | null> => {
  const { data, error } = await supabase.rpc('get_default_image_for_blog_title', { title_to_check: title });
  if (error) {
    console.error('Erreur lors de la récupération de l\'image par défaut pour le titre:', error);
    return null;
  }
  return data || null;
};
