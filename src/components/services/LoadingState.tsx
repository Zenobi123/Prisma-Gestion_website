
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <section id="services" className="bg-prisma-light-gray py-16 md:py-20">
      <div className="section">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="heading-lg mb-3 md:mb-4 text-prisma-purple">Nos Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Chargement des services...
          </p>
          <div className="flex justify-center mt-4">
            <Loader2 className="h-8 w-8 animate-spin text-prisma-purple" />
          </div>
        </div>
      </div>
    </section>
  );
};
