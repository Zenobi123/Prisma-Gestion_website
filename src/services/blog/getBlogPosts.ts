
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostStatus } from "@/types/blog";

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: -1,
    title: "Les avantages de la comptabilité en ligne",
    excerpt: "Pourquoi passer à la comptabilité informatisée en 2025.",
    content: "",
    author: "Nathan OBIANG TIME",
    publishDate: "2025-04-22",
    status: "Publié",
    image: "/lovable-uploads/85999c6b-953e-4905-b204-fec3dfc4e72f.png",
    slug: "avantages-comptabilite-en-ligne",
    tags: ["Comptabilité"],
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: -2,
    title: "Les nouvelles normes fiscales et comptables pour 2025",
    excerpt: "Lois des finances 2025, ce que vous devez savoir.",
    content: "",
    author: "Nathan OBIANG TIME",
    publishDate: "2025-04-22",
    status: "Publié",
    image: "/lovable-uploads/4d9dc424-4eb4-4aca-aba9-e462d333f67c.png",
    slug: "nouvelles-normes-fiscales-2025",
    tags: ["Fiscalité"],
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: -3,
    title: "Impôt Général Synthétique (IGS)",
    excerpt: "IGS, ce qui change.",
    content: "",
    author: "Nathan OBIANG TIME",
    publishDate: "2025-04-22",
    status: "Publié",
    image: "/lovable-uploads/a9b4950e-4e9a-4b2d-89ed-55266f59fd49.png",
    slug: "impot-general-synthetique-igs",
    tags: ["Fiscalité"],
    seoTitle: "",
    seoDescription: "",
  }
];

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

async function seedDefaultBlogPosts(existingSlugs: string[]) {
  for (const post of DEFAULT_BLOG_POSTS) {
    if (!existingSlugs.includes(post.slug)) {
      await supabase.from("blog_posts").insert([{
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        publish_date: post.publishDate,
        status: post.status,
        image: post.image,
        slug: post.slug,
        tags: post.tags,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription
      }]);
    }
  }
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log("Récupération des articles depuis Supabase...");
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("Aucun article trouvé. Vérifiez la table blog_posts dans Supabase.");
      return [];
    }

    console.log("Données récupérées de Supabase:", data);

    const posts = data.map(post => {
      // Utiliser directement la fonction utilitaire sans appel asynchrone
      const defaultImage = getDefaultImageForTitle(post.title);
      
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content || "",
        author: post.author || "",
        publishDate: post.publish_date || new Date().toISOString().split('T')[0],
        status: post.status as BlogPostStatus || "Brouillon",
        image: post.image || defaultImage,
        slug: post.slug || "",
        tags: Array.isArray(post.tags) ? post.tags : [],
        seoTitle: post.seo_title || "",
        seoDescription: post.seo_description || "",
      };
    });

    console.log("Récupération réussie, nombre d'articles:", posts.length);
    return posts;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
};

export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'Publié')
      .order('id', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des articles publiés:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('Aucun article publié trouvé dans Supabase.');
      return [];
    }

    return data.map(post => {
      // Utiliser directement la fonction utilitaire sans appel asynchrone
      const defaultImage = getDefaultImageForTitle(post.title);
      
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        content: post.content || "",
        author: post.author || "",
        publishDate: post.publish_date || new Date().toISOString().split('T')[0],
        status: post.status as BlogPostStatus || "Brouillon",
        image: post.image || defaultImage,
        slug: post.slug || "",
        tags: Array.isArray(post.tags) ? post.tags : [],
        seoTitle: post.seo_title || "",
        seoDescription: post.seo_description || "",
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles publiés:', error);
    return [];
  }
};

export { getBlogPostBySlug } from './getBlogPost';
