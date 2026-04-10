
import { supabase } from "@/integrations/supabase/client";

// Supprime par id
export const deleteBlogPost = async (postId: number): Promise<void> => {
  console.log("Suppression de l'article ID:", postId);

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    throw error;
  }

  console.log("Article supprimé avec succès, ID:", postId);
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
};

// Supprime tous les posts trouvés par titre (fragment)
export const deleteBlogPostByTitle = async (titleToDelete: string): Promise<void> => {
  console.log("Suppression des articles avec le titre :", titleToDelete);

  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title')
    .ilike('title', `%${titleToDelete}%`);

  if (fetchError) {
    console.error("Erreur lors de la recherche du post à supprimer:", fetchError);
    throw fetchError;
  }

  if (!posts || posts.length === 0) {
    console.log("Aucun post trouvé pour le titre :", titleToDelete);
    return;
  }

  const ids = posts.map(p => p.id);

  const { error: deleteError } = await supabase
    .from('blog_posts')
    .delete()
    .in('id', ids);

  if (deleteError) {
    console.error("Erreur lors de la suppression des posts:", deleteError);
    throw deleteError;
  }

  console.log("Articles supprimés avec succès :", ids);
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
};
