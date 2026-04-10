
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostStatus } from "@/types/blog";

// Fonction utilitaire pour obtenir l'image par défaut basée sur le titre
const getDefaultImageForTitle = (title: string): string => {
  if (title.includes("Impôt Général Synthétique") || title.includes("IGS")) {
    return "/lovable-uploads/a9b4950e-4e9a-4b2d-89ed-55266f59fd49.png";
  } else if (title.includes("Les nouvelles normes fiscales")) {
    return "/lovable-uploads/4d9dc424-4eb4-4aca-aba9-e462d333f67c.png";
  } else if (title.includes("Les avantages de la comptabilité")) {
    return "/lovable-uploads/85999c6b-953e-4905-b204-fec3dfc4e72f.png";
  }
  return "/placeholder.svg";
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      console.error(`Erreur lors de la récupération de l'article avec slug "${slug}":`, error);
      return null;
    }

    const defaultImage = getDefaultImageForTitle(data.title);

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt || "",
      content: data.content || "",
      author: data.author || "",
      publishDate: data.publish_date || new Date().toISOString().split('T')[0],
      status: data.status as BlogPostStatus || "Brouillon",
      image: data.image || defaultImage,
      slug: data.slug,
      tags: Array.isArray(data.tags) ? data.tags : [],
      seoTitle: data.seo_title || "",
      seoDescription: data.seo_description || "",
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article avec slug "${slug}":`, error);
    return null;
  }
};
