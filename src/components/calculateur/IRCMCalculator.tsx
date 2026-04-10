
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { toNumber } from '@/utils/numberConversion';
import TaxResultDisplay from './TaxResultDisplay';

const IRCMCalculator = () => {
  const [montantBrut, setMontantBrut] = useState('');
  const [tauxIRCM, setTauxIRCM] = useState('');
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    details: string;
  } | null>(null);

  const handleCalculate = () => {
    const montantBrutNum = toNumber(montantBrut);
    const tauxIRCMNum = toNumber(tauxIRCM);
    
    // Calcul simple pour l'IRCM
    const montantIRCM = Math.round(montantBrutNum * (tauxIRCMNum / 100));
    const montantNet = montantBrutNum - montantIRCM;
    
    setCalculationResult({
      taxAmount: montantIRCM,
      details: `Montant brut: ${montantBrutNum.toLocaleString()} F CFA\nTaux IRCM: ${tauxIRCMNum}%\nMontant IRCM: ${montantIRCM.toLocaleString()} F CFA\nMontant net: ${montantNet.toLocaleString()} F CFA`
    });
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Calculateur IRCM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="montantBrut">Montant Brut (F CFA)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="montantBrut"
              inputMode="numeric"
              placeholder="Entrez le montant brut"
              value={montantBrut}
              onChange={(e) => setMontantBrut(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tauxIRCM">Taux IRCM (%)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="tauxIRCM"
              inputMode="numeric"
              placeholder="Entrez le taux IRCM"
              value={tauxIRCM}
              onChange={(e) => setTauxIRCM(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleCalculate} 
          className="w-full sm:w-auto"
          disabled={!montantBrut || !tauxIRCM}
        >
          Calculer l'IRCM
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

export default IRCMCalculator;
