
import { memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrafficTab } from './tabs/TrafficTab';
import { BehaviorTab } from './tabs/BehaviorTab';
import { ConversionTab } from './tabs/ConversionTab';

const AnalyticsTabsComponent = () => {
  return (
    <Tabs defaultValue="traffic" className="space-y-4">
      <TabsList>
        <TabsTrigger value="traffic">Trafic</TabsTrigger>
        <TabsTrigger value="behavior">Comportement</TabsTrigger>
        <TabsTrigger value="conversion">Conversion</TabsTrigger>
      </TabsList>

      <TabsContent value="traffic">
        <TrafficTab />
      </TabsContent>

      <TabsContent value="behavior">
        <BehaviorTab />
      </TabsContent>

      <TabsContent value="conversion">
        <ConversionTab />
      </TabsContent>
    </Tabs>
  );
};

export const AnalyticsTabs = memo(AnalyticsTabsComponent);
