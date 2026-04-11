
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
    content: `
      <h2>Pourquoi opter pour la comptabilité en ligne ?</h2>
      <p>
        La gestion financière de votre entreprise est une tâche cruciale, et le passage à la comptabilité en ligne offre de nombreux avantages.
        En 2025, la dématérialisation et l'automatisation deviennent des éléments incontournables de la croissance des PME.
      </p>
      <div class="bg-gray-50">
        <h3>Les bénéfices principaux :</h3>
        <ul>
          <li><strong>Gain de temps</strong> : Automatisation de la saisie des données.</li>
          <li><strong>Accessibilité</strong> : Vos données disponibles 24/7 de n'importe où.</li>
          <li><strong>Sécurité</strong> : Sauvegarde automatique et protection des données dans le cloud.</li>
          <li><strong>Collaboration facilitée</strong> : Accès partagé avec votre expert-comptable.</li>
        </ul>
      </div>
      <p>
        Passez à la comptabilité en ligne et facilitez-vous la vie avec Prisma Gestion !
      </p>
    `,
    author: "Nathan OBIANG TIME",
    publishDate: "2025-04-22",
    status: "Publié",
    image: "/lovable-uploads/85999c6b-953e-4905-b204-fec3dfc4e72f.png",
    slug: "avantages-comptabilite-en-ligne",
    tags: ["Comptabilité"],
    seoTitle: "Les avantages de la comptabilité en ligne en 2025",
    seoDescription: "Découvrez pourquoi passer à la comptabilité informatisée en 2025 peut transformer votre entreprise.",
  },
  {
    id: -2,
    title: "Les nouvelles normes fiscales et comptables pour 2025",
    excerpt: "Lois des finances 2025, ce que vous devez savoir.",
    content: `
      <h2>Lois des finances 2025 : Quoi de neuf ?</h2>
      <p>
        Chaque année, de nouvelles lois des finances sont votées, modifiant ainsi le paysage fiscal et comptable des entreprises.
        Pour 2025, plusieurs changements majeurs ont été introduits et il est essentiel d'être bien informé pour rester conforme.
      </p>
      <div class="bg-gray-50">
        <h3>Principaux changements :</h3>
        <ul>
          <li>Mise à jour des taux d'imposition sur les sociétés.</li>
          <li>Nouvelles déductions fiscales pour les investissements éco-responsables.</li>
          <li>Changements dans la déclaration de la TVA et des obligations de reporting.</li>
          <li>Modifications liées à la loi de finances concernant les TPE/PME.</li>
        </ul>
      </div>
      <p>
        Contactez Prisma Gestion pour vous assurer d'être en totale conformité avec les nouvelles règles.
      </p>
    `,
    author: "Nathan OBIANG TIME",
    publishDate: "2025-04-22",
    status: "Publié",
    image: "/lovable-uploads/4d9dc424-4eb4-4aca-aba9-e462d333f67c.png",
    slug: "nouvelles-normes-fiscales-2025",
    tags: ["Fiscalité"],
    seoTitle: "Nouvelles normes fiscales et comptables 2025",
    seoDescription: "Tout ce que vous devez savoir sur la loi de finances 2025 et les nouvelles obligations fiscales.",
  },
  {
    id: -3,
    title: "Impôt Général Synthétique (IGS)",
    excerpt: "IGS, ce qui change.",
    content: `
      <h2>Comprendre l'Impôt Général Synthétique (IGS)</h2>
      <p>
        L'Impôt Général Synthétique (IGS) remplace plusieurs taxes et impôts pour simplifier les obligations fiscales
        des petites entreprises. Mais quels sont exactement les changements et qui est concerné ?
      </p>
      <div class="bg-gray-50">
        <h3>Ce que vous devez savoir sur l'IGS :</h3>
        <ul>
          <li><strong>Simplification</strong> : Un impôt unique en remplacement de la patente, de l'IRPP, de la TVA (sous certains seuils), etc.</li>
          <li><strong>Assiette fiscale</strong> : Le calcul est basé sur le chiffre d'affaires.</li>
          <li><strong>Modalités de paiement</strong> : Un échéancier souvent plus adapté aux petites structures.</li>
        </ul>
      </div>
      <p>
        Notre équipe d'experts est à votre disposition pour analyser votre éligibilité à l'IGS et optimiser votre situation fiscale.
      </p>
    `,
    author: "Nathan OBIANG TIME",
    publishDate: "2025-04-22",
    status: "Publié",
    image: "/lovable-uploads/a9b4950e-4e9a-4b2d-89ed-55266f59fd49.png",
    slug: "impot-general-synthetique-igs",
    tags: ["Fiscalité"],
    seoTitle: "Impôt Général Synthétique (IGS) : Ce qui change",
    seoDescription: "Découvrez l'Impôt Général Synthétique (IGS), comment il fonctionne et ce qui change pour les entreprises.",
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
      const defaultPost = DEFAULT_BLOG_POSTS.find(p => p.slug === post.slug);
      
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || defaultPost?.excerpt || "",
        content: post.content || defaultPost?.content || "",
        author: post.author || defaultPost?.author || "",
        publishDate: post.publish_date || defaultPost?.publishDate || new Date().toISOString().split('T')[0],
        status: post.status as BlogPostStatus || defaultPost?.status || "Brouillon",
        image: post.image || defaultImage || defaultPost?.image,
        slug: post.slug || "",
        tags: Array.isArray(post.tags) ? post.tags : defaultPost?.tags || [],
        seoTitle: post.seo_title || defaultPost?.seoTitle || "",
        seoDescription: post.seo_description || defaultPost?.seoDescription || "",
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
      const defaultPost = DEFAULT_BLOG_POSTS.find(p => p.slug === post.slug);
      
      return {
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || defaultPost?.excerpt || "",
        content: post.content || defaultPost?.content || "",
        author: post.author || defaultPost?.author || "",
        publishDate: post.publish_date || defaultPost?.publishDate || new Date().toISOString().split('T')[0],
        status: post.status as BlogPostStatus || defaultPost?.status || "Brouillon",
        image: post.image || defaultImage || defaultPost?.image,
        slug: post.slug || "",
        tags: Array.isArray(post.tags) ? post.tags : defaultPost?.tags || [],
        seoTitle: post.seo_title || defaultPost?.seoTitle || "",
        seoDescription: post.seo_description || defaultPost?.seoDescription || "",
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles publiés:', error);
    return [];
  }
};

export { getBlogPostBySlug } from './getBlogPost';
