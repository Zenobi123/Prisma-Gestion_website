
import { cn } from '@/lib/utils';
import { ServiceType } from '@/types/services';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ServiceTabsProps {
  services: ServiceType[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ServiceTabs = ({ services, activeTab, onTabChange }: ServiceTabsProps) => {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeService = services.find(s => s.id === activeTab);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg shadow-sm text-sm font-medium text-foreground"
        >
          <span>{activeService?.title || 'Sélectionner un service'}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              mobileOpen && 'rotate-180'
            )}
          />
        </button>

        {mobileOpen && (
          <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  onTabChange(service.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === service.id
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {service.title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap border-b overflow-x-auto scrollbar-hide">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onTabChange(service.id)}
          className={cn(
            'px-5 py-4 text-sm md:text-base font-medium transition-colors whitespace-nowrap flex-shrink-0 relative',
            activeTab === service.id
              ? 'text-primary border-b-2 border-primary bg-card shadow-lg'
              : 'text-muted-foreground hover:text-primary hover:bg-card/50'
          )}
          aria-selected={activeTab === service.id}
          role="tab"
        >
          {service.title}
          {activeTab === service.id && (
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          )}
        </button>
      ))}
    </div>
  );
};
