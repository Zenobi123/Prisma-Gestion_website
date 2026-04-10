
import { cn } from '@/lib/utils';
import { ServiceType } from '@/types/services';

interface ServiceTabsProps {
  services: ServiceType[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ServiceTabs = ({ services, activeTab, onTabChange }: ServiceTabsProps) => {
  return (
    <div className="flex flex-wrap border-b overflow-x-auto md:overflow-visible scrollbar-hide">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onTabChange(service.id)}
          className={cn(
            'px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-medium transition-colors whitespace-nowrap flex-shrink-0 relative',
            activeTab === service.id
              ? 'text-prisma-purple border-b-2 border-prisma-chartreuse bg-white shadow-lg'
              : 'text-gray-500 hover:text-prisma-purple hover:bg-white/50'
          )}
          aria-selected={activeTab === service.id}
          role="tab"
        >
          {service.title}
          {activeTab === service.id && (
            <div className="absolute inset-0 bg-prisma-chartreuse/5 pointer-events-none" />
          )}
        </button>
      ))}
    </div>
  );
};
