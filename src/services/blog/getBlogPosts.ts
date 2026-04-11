
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostStatus } from "@/types/blog";

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: -10,
    title: "Veille impots.cm : dernières publications fiscales",
    excerpt: "Consultez rapidement les derniers documents, actualités et notes publiés sur impots.cm.",
    content: `
      <h2>Dernières parutions de impots.cm</h2>
      <p>
        Cet article de veille vous permet d'accéder directement aux informations les plus récentes publiées
        par la Direction Générale des Impôts du Cameroun.
      </p>
      <div class="bg-gray-50">
        <h3>Accès rapide</h3>
        <ul>
          <li><a href="https://www.impots.cm/" target="_blank" rel="noopener noreferrer">Page d'accueil impots.cm</a></li>
          <li><a href="https://www.impots.cm/fr/actualites" target="_blank" rel="noopener noreferrer">Rubrique actualités</a></li>
          <li><a href="https://www.impots.cm/fr/documentations" target="_blank" rel="noopener noreferrer">Rubrique documents</a></li>
        </ul>
      </div>
      <p>
        Astuce: ouvrez les rubriques ci-dessus pour identifier immédiatement la dernière publication.
      </p>
    `,
    author: "PRISMA GESTION",
    publishDate: "2026-04-10",
    status: "Publié",
    image: "/blog-images/veille-impots.jpg",
    slug: "veille-impots-cm-dernieres-publications",
    tags: ["Veille réglementaire", "Fiscalité"],
    seoTitle: "Veille impots.cm : dernières publications fiscales",
    seoDescription: "Suivez les dernières publications, actualités et documents publiés sur impots.cm."
  },
  {
    id: -11,
    title: "Veille cnps.cm : dernières actualités sociales",
    excerpt: "Retrouvez le dernier élément publié sur cnps.cm : communiqué, document ou news officielle.",
    content: `
      <h2>Dernières parutions de cnps.cm</h2>
      <p>
        Cette veille centralise l'accès aux contenus récents diffusés par la CNPS.
      </p>
      <div class="bg-gray-50">
        <h3>Accès rapide</h3>
        <ul>
          <li><a href="https://www.cnps.cm/" target="_blank" rel="noopener noreferrer">Page d'accueil cnps.cm</a></li>
          <li><a href="https://www.cnps.cm/actualites/" target="_blank" rel="noopener noreferrer">Rubrique actualités</a></li>
          <li><a href="https://www.cnps.cm/documentation/" target="_blank" rel="noopener noreferrer">Rubrique documentation</a></li>
        </ul>
      </div>
      <p>
        Vérifiez ces sections pour consulter la publication la plus récente.
      </p>
    `,
    author: "PRISMA GESTION",
    publishDate: "2026-04-10",
    status: "Publié",
    image: "/blog-images/veille-cnps.jpg",
    slug: "veille-cnps-cm-dernieres-actualites",
    tags: ["Veille réglementaire", "Social"],
    seoTitle: "Veille cnps.cm : dernières actualités sociales",
    seoDescription: "Accédez rapidement aux dernières actualités et documents publiés sur cnps.cm."
  },
  {
    id: -12,
    title: "Veille egecam.cm : nouveaux documents et annonces",
    excerpt: "Un point d'accès direct vers la dernière publication visible sur egecam.cm.",
    content: `
      <h2>Dernières parutions de egecam.cm</h2>
      <p>
        Utilisez cette page pour accéder en un clic aux nouveautés publiées par EGECAM.
      </p>
      <div class="bg-gray-50">
        <h3>Accès rapide</h3>
        <ul>
          <li><a href="https://egecam.cm/" target="_blank" rel="noopener noreferrer">Page d'accueil egecam.cm</a></li>
          <li><a href="https://egecam.cm/category/actualites/" target="_blank" rel="noopener noreferrer">Rubrique actualités</a></li>
          <li><a href="https://egecam.cm/category/documents/" target="_blank" rel="noopener noreferrer">Rubrique documents</a></li>
        </ul>
      </div>
      <p>
        Consultez ces sections pour repérer le dernier contenu publié.
      </p>
    `,
    author: "PRISMA GESTION",
    publishDate: "2026-04-10",
    status: "Publié",
    image: "/blog-images/veille-egecam.jpg",
    slug: "veille-egecam-cm-documents-annonces",
    tags: ["Veille", "Institutionnel"],
    seoTitle: "Veille egecam.cm : nouveaux documents et annonces",
    seoDescription: "Suivi des dernières publications de egecam.cm (documents, actualités, annonces)."
  },
  {
    id: -13,
    title: "Veille DGICAM Facebook : dernière publication",
    excerpt: "Suivez la dernière publication postée sur la page Facebook officielle DGICAM.",
    content: `
      <h2>Dernières parutions Facebook DGICAM</h2>
      <p>
        Cette veille pointe vers la page officielle DGICAM pour consulter le dernier post publié.
      </p>
      <div class="bg-gray-50">
        <h3>Lien direct</h3>
        <ul>
          <li><a href="https://www.facebook.com/DGICAM" target="_blank" rel="noopener noreferrer">Page Facebook DGICAM</a></li>
        </ul>
      </div>
      <p>
        Le premier post affiché en haut du fil correspond généralement à la publication la plus récente.
      </p>
    `,
    author: "PRISMA GESTION",
    publishDate: "2026-04-10",
    status: "Publié",
    image: "/blog-images/veille-dgicam.jpg",
    slug: "veille-facebook-dgicam-derniere-publication",
    tags: ["Veille", "Réseaux sociaux"],
    seoTitle: "Veille DGICAM Facebook : dernière publication",
    seoDescription: "Accès rapide à la dernière publication de la page Facebook DGICAM."
  },
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
  } else if (title.toLowerCase().includes("veille") && title.toLowerCase().includes("impot")) {
    return "/blog-images/veille-impots.jpg";
  } else if (title.toLowerCase().includes("veille") && title.toLowerCase().includes("cnps")) {
    return "/blog-images/veille-cnps.jpg";
  } else if (title.toLowerCase().includes("veille") && title.toLowerCase().includes("egecam")) {
    return "/blog-images/veille-egecam.jpg";
  } else if (title.toLowerCase().includes("veille") && title.toLowerCase().includes("dgicam")) {
    return "/blog-images/veille-dgicam.jpg";
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

async function ensureDefaultBlogPostsSeeded(): Promise<void> {
  const { data: slugRows, error } = await supabase
    .from("blog_posts")
    .select("slug");

  if (error) {
    console.error("Impossible de vérifier les articles par défaut:", error);
    return;
  }

  const existingSlugs = (slugRows || [])
    .map((row) => row.slug)
    .filter((slug): slug is string => typeof slug === "string");

  await seedDefaultBlogPosts(existingSlugs);
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    await ensureDefaultBlogPostsSeeded();
    console.log("Récupération des articles depuis Supabase...");
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      if ((error as { code?: string }).code === 'SUPABASE_DISABLED') {
        return DEFAULT_BLOG_POSTS;
      }
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
    await ensureDefaultBlogPostsSeeded();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'Publié')
      .order('id', { ascending: false });

    if (error) {
      if ((error as { code?: string }).code === 'SUPABASE_DISABLED') {
        return DEFAULT_BLOG_POSTS.filter(p => p.status === 'Publié');
      }
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
