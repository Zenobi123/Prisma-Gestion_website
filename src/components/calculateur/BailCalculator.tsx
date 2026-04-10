
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { toNumber } from '@/utils/numberConversion';
import TaxResultDisplay from './TaxResultDisplay';

const BailCalculator = () => {
  const [valeurLocative, setValeurLocative] = useState('');
  const [tauxImposition, setTauxImposition] = useState('');
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    details: string;
  } | null>(null);

  const handleCalculate = () => {
    const valeurLocativeNum = toNumber(valeurLocative);
    const tauxImpositionNum = toNumber(tauxImposition);
    
    // Calcul du montant d'imposition sur le bail
    const montantImpot = Math.round(valeurLocativeNum * (tauxImpositionNum / 100));
    
    setCalculationResult({
      taxAmount: montantImpot,
      details: `Valeur locative: ${valeurLocativeNum.toLocaleString()} F CFA\nTaux d'imposition: ${tauxImpositionNum}%\nMontant d'impôt calculé: ${montantImpot.toLocaleString()} F CFA`
    });
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Calculateur d'Impôt sur Bail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="valeurLocative">Valeur Locative (F CFA)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="valeurLocative"
              inputMode="numeric"
              placeholder="Entrez la valeur locative"
              value={valeurLocative}
              onChange={(e) => setValeurLocative(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tauxImposition">Taux d'Imposition (%)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="tauxImposition"
              inputMode="numeric"
              placeholder="Entrez le taux d'imposition"
              value={tauxImposition}
              onChange={(e) => setTauxImposition(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleCalculate} 
          className="w-full sm:w-auto"
          disabled={!valeurLocative || !tauxImposition}
        >
          Calculer l'Impôt
        </Button>
        
        {calculationResult && (
          <TaxResultDisplay
            result={{
              classe: 0,
              montant: calculationResult.taxAmount,
              chiffreAffaires: 0,
              minRange: 0,
              maxRange: 0,
              message: calculationResult.details
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default BailCalculator;
