
import { useState, useEffect } from 'react';
import { ImageService, ImageConfig } from '@/services/imageService';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  fallback, 
  loading = 'lazy',
  onError,
  className,
  ...props 
}: OptimizedImageProps) => {
  const [imageConfig, setImageConfig] = useState<ImageConfig>(() => 
    ImageService.getOptimizedImageConfig(src, alt, { fallback, loading })
  );
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageConfig(ImageService.getOptimizedImageConfig(src, alt, { fallback, loading }));
    setHasError(false);
    setIsLoading(true);
  }, [src, alt, fallback, loading]);

  const handleError = () => {
    if (!hasError && imageConfig.fallback) {
      setHasError(true);
      setImageConfig(prev => ({ ...prev, src: prev.fallback! }));
    }
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <img
      src={imageConfig.src}
      alt={imageConfig.alt}
      loading={imageConfig.loading}
      onError={handleError}
      onLoad={handleLoad}
      className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
      {...props}
    />
  );
};
