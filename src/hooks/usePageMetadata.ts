
import { useEffect } from 'react';
import { MetadataService, PageMetadata } from '@/services/metadataService';
import { AnalyticsService } from '@/services/analyticsService';

export const usePageMetadata = (metadata?: Partial<PageMetadata>) => {
  useEffect(() => {
    const pageMetadata = MetadataService.createPageMetadata(metadata || {});
    
    // Update document title
    document.title = pageMetadata.title;
    
    // Track page view
    AnalyticsService.trackPageView(window.location.pathname, pageMetadata.title);
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageMetadata.description);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageMetadata.canonicalUrl!);
    
  }, [metadata]);
};
