
import { supabase } from "@/integrations/supabase/client";

export const publishBlogPost = async (postId: number): Promise<void> => {
  console.log("Publication de l'article ID:", postId);

  const { error } = await supabase
    .from('blog_posts')
    .update({
      status: 'Publié',
      publish_date: new Date().toISOString().split('T')[0]
    })
    .eq('id', postId);

  if (error) {
    console.error('Erreur lors de la publication de l\'article:', error);
    throw error;
  }

  console.log("Article publié avec succès, ID:", postId);
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
};
