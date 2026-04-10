import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getPublishedBlogPosts } from '@/services/blog/getBlogPosts';
import { BlogPost } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';

interface OfficialWatchItem {
  id: string;
  source: string;
  title: string;
  description: string;
  url: string;
  image: string;
}

const officialWatchItems: OfficialWatchItem[] = [
  {
    id: 'impots-cm',
    source: 'impots.cm',
    title: 'Direction Générale des Impôts (Cameroun)',
    description: 'Consultez les dernières parutions (documents, notes, actualités) publiées sur impots.cm.',
    url: 'https://www.impots.cm',
    image: 'https://images.unsplash.com/photo-1554224154-26032ff26273?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'cnps-cm',
    source: 'cnps.cm',
    title: 'CNPS Cameroun',
    description: 'Accédez aux nouveautés officielles de la CNPS : communiqués, documents et actualités sociales.',
    url: 'https://www.cnps.cm',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'egecam-cm',
    source: 'egecam.cm',
    title: 'eGCE / egecam.cm',
    description: 'Suivez les dernières mises à jour du portail egecam.cm (annonces, procédures, informations utiles).',
    url: 'https://egecam.cm',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'dgi-facebook',
    source: 'Facebook DGI CAM',
    title: 'Page Facebook officielle DGI Cameroun',
    description: 'Retrouvez les dernières publications et annonces postées sur la page Facebook de la DGI Cameroun.',
    url: 'https://web.facebook.com/DGICAM',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=70',
  },
];

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    isMounted.current = true;
    
    const fetchPosts = async () => {
      if (!isMounted.current) return;
      
      try {
        setIsLoading(true);
        const publishedPosts = await getPublishedBlogPosts();
        
        if (!isMounted.current) return;
        
        console.log('Articles publiés chargés:', publishedPosts.length);
        
        setBlogPosts(publishedPosts);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    fetchPosts();
    
    channelRef.current = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts'
        },
        (payload) => {
          console.log('BlogSection: Changement détecté dans la table blog_posts:', payload);
          if (isMounted.current) {
            fetchPosts();
          }
        }
      )
      .subscribe();
    
    const handleInternalBlogUpdate = () => {
      console.log('BlogSection: Mise à jour interne des articles de blog détectée');
      if (isMounted.current) {
        fetchPosts();
      }
    };
    
    window.addEventListener('blogPostsUpdated', handleInternalBlogUpdate);
    
    return () => {
      isMounted.current = false;
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      window.removeEventListener('blogPostsUpdated', handleInternalBlogUpdate);
    };
  }, []);

  const getDefaultImage = (title: string): string => {
    if (title.includes("Impôt Général Synthétique")) {
      return "/lovable-uploads/a9b4950e-4e9a-4b2d-89ed-55266f59fd49.png";
    } else if (title.includes("Les nouvelles normes fiscales")) {
      return "/lovable-uploads/4d9dc424-4eb4-4aca-aba9-e462d333f67c.png";
    } else if (title.includes("Les avantages de la comptabilité")) {
      return "/lovable-uploads/85999c6b-953e-4905-b204-fec3dfc4e72f.png";
    }
    return "/placeholder.svg";
  };

  return (
    <section id="blog" className="section py-12 xs:py-16 md:py-20 bg-gray-50">
      <div className="container">
        <h2 className="heading-lg mb-3 md:mb-4 text-prisma-purple text-center">Notre Blog</h2>
        <p className="text-gray-600 mb-8 xs:mb-10 md:mb-12 max-w-3xl mx-auto text-center">
          Restez informé des dernières tendances, conseils et actualités dans les domaines de la comptabilité, 
          des ressources humaines, et des technologies d'entreprise.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prisma-purple"></div>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.log(`Image non chargée pour ${post.title}, utilisation de l'image par défaut`);
                      target.onerror = null;
                      target.src = getDefaultImage(post.title);
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-prisma-purple/10 text-prisma-purple text-xs font-medium px-2.5 py-1 rounded">
                      {post.tags[0] || "Article"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(post.publishDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-prisma-purple">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-prisma-chartreuse font-medium text-sm hover:underline"
                  >
                    Lire la suite <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucun article publié pour le moment.</p>
          </div>
        )}

        <div className="mt-12 md:mt-16">
          <h3 className="text-2xl font-bold text-prisma-purple text-center mb-3">Veille réglementaire & actualités officielles</h3>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Quatre sources essentielles à consulter pour suivre les dernières publications utiles en fiscalité, social et administration.
          </p>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {officialWatchItems.map((item) => (
              <article key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <span className="inline-block bg-prisma-purple/10 text-prisma-purple text-xs font-medium px-2.5 py-1 rounded mb-3">
                    {item.source}
                  </span>
                  <h4 className="font-semibold text-base text-prisma-purple mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-prisma-chartreuse font-medium text-sm hover:underline"
                  >
                    Voir la dernière parution <ExternalLink size={15} className="ml-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        
        {blogPosts.length > 0 && (
          <div className="mt-10 text-center">
            <Link 
              to="/blog"
              className="btn-primary inline-flex items-center"
            >
              Voir tous les articles <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
