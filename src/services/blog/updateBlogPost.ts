
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";

// Convertir un slug en format valide
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const updateBlogPost = async (post: BlogPost): Promise<void> => {
  console.log("Mise à jour de l'article:", post);
  
  // Générer un slug à partir du titre s'il n'est pas fourni
  const slug = post.slug || createSlug(post.title);

  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      publish_date: post.publishDate,
      status: post.status,
      image: post.image,
      slug: slug,
      tags: post.tags,
      seo_title: post.seoTitle,
      seo_description: post.seoDescription
    })
    .eq('id', post.id);

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    throw error;
  }

  console.log("Article mis à jour avec succès, ID:", post.id);

  // Déclencher l'événement de mise à jour
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
};

// FONCTION POUR METTRE À JOUR SEULEMENT LE CONTENU D'UN ARTICLE PAR SON TITRE
export const updateBlogPostContentByTitle = async (title: string, newContent: string): Promise<void> => {
  console.log(`Mise à jour du contenu de l'article "${title}"`);
  
  const { error } = await supabase
    .from('blog_posts')
    .update({ content: newContent })
    .eq('title', title);

  if (error) {
    console.error("Erreur lors de la mise à jour du contenu de l'article:", error);
    throw error;
  }
  
  console.log(`Contenu mis à jour avec succès pour l'article "${title}"`);
  
  // Déclencher l'événement si besoin
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
};
