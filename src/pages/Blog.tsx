
import { useEffect, useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/blog/BlogCard';
import { BlogPost } from '@/types/blog';
import { getPublishedBlogPosts } from '@/services/blog/getBlogPosts';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { SiteBreadcrumb } from '@/components/ui/SiteBreadcrumb';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  usePageMetadata({
    title: "Blog | PRISMA GESTION",
    description: "Découvrez nos articles sur l'expertise comptable, la fiscalité, la finance et le conseil aux entreprises. Restez informé des dernières actualités.",
    keywords: ["blog", "expertise comptable", "fiscalité", "conseil", "actualités"],
    canonicalUrl: `${window.location.origin}/blog`
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPublishedBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-prisma-purple"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen">
      <SEOHead
        config={{
          title: "Blog | PRISMA GESTION",
          description: "Découvrez nos articles sur l'expertise comptable, la fiscalité, la finance et le conseil aux entreprises. Restez informé des dernières actualités.",
          keywords: ["blog", "expertise comptable", "fiscalité", "conseil", "actualités"],
          canonicalUrl: `${window.location.origin}/blog`
        }}
      />
      <Navbar />
      <main className="pt-24 xs:pt-28 md:pt-36 lg:pt-44 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <SiteBreadcrumb items={[{ label: "Blog" }]} />
          </div>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-prisma-purple mb-4">
              Notre Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos conseils d'experts, analyses du marché et actualités 
              dans les domaines de la comptabilité, fiscalité et finance.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun article publié pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPost && (
                <BlogCard post={featuredPost} featured={true} />
              )}
              {regularPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
