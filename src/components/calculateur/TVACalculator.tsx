
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { toNumber } from '@/utils/numberConversion';
import TaxResultDisplay from './TaxResultDisplay';

const TVACalculator = () => {
  const [montantHT, setMontantHT] = useState('');
  const [tauxTVA, setTauxTVA] = useState('');
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    details: string;
  } | null>(null);

  const handleCalculate = () => {
    const montantHTNum = toNumber(montantHT);
    const tauxTVANum = toNumber(tauxTVA);
    
    // Calcul de la TVA
    const montantTVA = Math.round(montantHTNum * (tauxTVANum / 100));
    const montantTTC = montantHTNum + montantTVA;
    
    setCalculationResult({
      taxAmount: montantTVA,
      details: `Montant HT: ${montantHTNum.toLocaleString()} F CFA\nTaux TVA: ${tauxTVANum}%\nMontant TVA: ${montantTVA.toLocaleString()} F CFA\nMontant TTC: ${montantTTC.toLocaleString()} F CFA`
    });
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Calculateur TVA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="montantHT">Montant Hors Taxe (F CFA)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="montantHT"
              inputMode="numeric"
              placeholder="Entrez le montant HT"
              value={montantHT}
              onChange={(e) => setMontantHT(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tauxTVA">Taux de TVA (%)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="tauxTVA"
              inputMode="numeric"
              placeholder="Entrez le taux de TVA"
              value={tauxTVA}
              onChange={(e) => setTauxTVA(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleCalculate} 
          className="w-full sm:w-auto"
          disabled={!montantHT || !tauxTVA}
        >
          Calculer la TVA
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

export default TVACalculator;
