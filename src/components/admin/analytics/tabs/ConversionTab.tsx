
import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ConversionTabComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taux de conversion</CardTitle>
        <CardDescription>
          Mesure de l'efficacité des actions utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span>Contact → Message envoyé</span>
            <span className="font-bold text-green-600">12.5%</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span>Services → Demande de devis</span>
            <span className="font-bold text-blue-600">8.3%</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span>Blog → Temps de lecture &gt; 2min</span>
            <span className="font-bold text-purple-600">45%</span>
          </div>
          <div className="flex justify-between items-center p-3 border rounded-lg">
            <span>Calculateur → Résultat calculé</span>
            <span className="font-bold text-orange-600">67%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ConversionTab = memo(ConversionTabComponent);
