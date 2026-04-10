
import { ServiceType } from '@/types/services';
import { ServiceInfo } from './ServiceInfo';
import { ServiceImage } from './ServiceImage';

interface ServiceTabContentProps {
  service: ServiceType;
}

export const ServiceTabContent = ({ service }: ServiceTabContentProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8" key={service.id}>
      <ServiceInfo service={service} />
      <ServiceImage image={service.image} title={service.title} />
    </div>
  );
};
