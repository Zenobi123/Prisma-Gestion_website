
import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BehaviorTabComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comportement des utilisateurs</CardTitle>
        <CardDescription>
          Analyse du comportement de navigation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2:34</div>
            <p className="text-sm text-gray-600">Temps moyen sur le site</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3.2</div>
            <p className="text-sm text-gray-600">Pages par session</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">35%</div>
            <p className="text-sm text-gray-600">Taux de rebond</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const BehaviorTab = memo(BehaviorTabComponent);
