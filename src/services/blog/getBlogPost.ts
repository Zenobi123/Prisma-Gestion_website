
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostStatus } from "@/types/blog";
import { DEFAULT_BLOG_POSTS } from "./getBlogPosts";

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

    if (error) {
      if ((error as { code?: string }).code === 'SUPABASE_DISABLED') {
        return DEFAULT_BLOG_POSTS.find(p => p.slug === slug) ?? null;
      }
      console.error(`Erreur lors de la récupération de l'article avec slug "${slug}":`, error);
      return null;
    }

    if (!data) {
      return DEFAULT_BLOG_POSTS.find(p => p.slug === slug) ?? null;
    }

    const defaultImage = getDefaultImageForTitle(data.title);
    const defaultPost = DEFAULT_BLOG_POSTS.find(p => p.slug === data.slug);

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt || defaultPost?.excerpt || "",
      content: data.content || defaultPost?.content || "",
      author: data.author || defaultPost?.author || "",
      publishDate: data.publish_date || defaultPost?.publishDate || new Date().toISOString().split('T')[0],
      status: data.status as BlogPostStatus || defaultPost?.status || "Brouillon",
      image: data.image || defaultImage || defaultPost?.image,
      slug: data.slug,
      tags: Array.isArray(data.tags) ? data.tags : defaultPost?.tags || [],
      seoTitle: data.seo_title || defaultPost?.seoTitle || "",
      seoDescription: data.seo_description || defaultPost?.seoDescription || "",
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article avec slug "${slug}":`, error);
    return null;
  }
};
