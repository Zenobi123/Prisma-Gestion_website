
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapService {
  private static readonly BASE_URL = window.location.origin;
  
  static generateSitemapXml(urls: SitemapUrl[]): string {
    const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
  }

  static async generateDynamicSitemap(): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = [
      {
        loc: `${this.BASE_URL}/`,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: `${this.BASE_URL}/blog`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: `${this.BASE_URL}/outils`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: `${this.BASE_URL}/outils/calculateur-impots`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    try {
      // Dynamically add blog posts
      const { getPublishedBlogPosts } = await import('@/services/blog');
      const blogPosts = await getPublishedBlogPosts();
      
      blogPosts.forEach(post => {
        urls.push({
          loc: `${this.BASE_URL}/blog/${post.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: post.publishDate
        });
      });
    } catch (error) {
      console.error('Erreur lors de la génération du sitemap dynamique:', error);
    }

    return urls;
  }

  static async downloadSitemap(): Promise<void> {
    const urls = await this.generateDynamicSitemap();
    const sitemapXml = this.generateSitemapXml(urls);
    
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
