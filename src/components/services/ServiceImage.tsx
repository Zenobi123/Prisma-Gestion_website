
import { Image } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ServiceImageProps {
  image?: string;
  title: string;
}

export const ServiceImage = ({ image, title }: ServiceImageProps) => {
  return (
    <div className="bg-prisma-light-gray rounded-lg p-4 md:p-6 flex items-center justify-center">
      {image ? (
        <div className="text-center w-full">
          <div className="relative w-full h-48 mb-3 md:mb-4 overflow-hidden rounded-lg">
            <OptimizedImage 
              src={image} 
              alt={`Service ${title}`} 
              className="w-full h-full object-cover"
              fallback="/placeholder.svg"
            />
          </div>
          <h4 className="text-prisma-purple font-medium mb-2 text-sm md:text-base">Solutions personnalisées</h4>
          <p className="text-xs md:text-sm text-gray-600">
            Chaque service est adapté à vos besoins spécifiques pour garantir des résultats optimaux.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-prisma-purple/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Image className="text-prisma-purple h-8 w-8" />
          </div>
          <h4 className="text-prisma-purple font-medium mb-2 text-sm md:text-base">Solutions personnalisées</h4>
          <p className="text-xs md:text-sm text-gray-600">
            Chaque service est adapté à vos besoins spécifiques pour garantir des résultats optimaux.
          </p>
        </div>
      )}
    </div>
  );
};
