
export interface ImageConfig {
  src: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

export class ImageService {
  private static readonly DEFAULT_FALLBACK = '/placeholder.svg';
  private static readonly LOADING_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';

  static validateImageUrl(url: string): boolean {
    try {
      const urlObject = new URL(url, window.location.origin);
      return urlObject.protocol === 'http:' || urlObject.protocol === 'https:' || urlObject.protocol === 'data:';
    } catch {
      return false;
    }
  }

  static getOptimizedImageConfig(src: string, alt: string, options?: Partial<ImageConfig>): ImageConfig {
    const fallback = options?.fallback || this.DEFAULT_FALLBACK;
    const loading = options?.loading || 'lazy';

    return {
      src: this.validateImageUrl(src) ? src : fallback,
      alt,
      fallback,
      loading
    };
  }

  static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  static async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadImage(url).catch(() => {}));
    await Promise.allSettled(promises);
  }
}
