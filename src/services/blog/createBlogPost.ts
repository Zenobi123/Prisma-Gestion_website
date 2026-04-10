
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, NewBlogPost } from "@/types/blog";

// Convertir un slug en format valide
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const addBlogPost = async (post: NewBlogPost): Promise<number> => {
  console.log("Ajout d'un nouvel article:", post);
  
  // Générer un slug à partir du titre s'il n'est pas fourni
  const slug = post.slug || createSlug(post.title);

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([
      {
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
      }
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Erreur lors de l\'ajout de l\'article:', error);
    throw error;
  }

  if (!data) {
    throw new Error("Aucune donnée retournée après l'insertion");
  }

  console.log("Article ajouté avec succès, ID:", data.id);

  // Déclencher l'événement de mise à jour
  window.dispatchEvent(new CustomEvent('blogPostsUpdated'));

  return data.id;
};
