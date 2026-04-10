
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toNumber } from '@/utils/numberConversion';
import TaxResultDisplay from './TaxResultDisplay';

const AbattageCalculator = () => {
  const [baseValue, setBaseValue] = useState('');
  const [deductibles, setDeductibles] = useState('');
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    details: string;
  } | null>(null);

  const handleCalculate = () => {
    const baseValueNum = toNumber(baseValue);
    const deductiblesNum = toNumber(deductibles);
    
    // Calcul simple pour l'abattage
    const abattage = Math.max(0, baseValueNum - deductiblesNum);
    
    setCalculationResult({
      taxAmount: Math.round(abattage),
      details: `Valeur de base: ${baseValueNum.toLocaleString()} F CFA\nDéductibles: ${deductiblesNum.toLocaleString()} F CFA\nAbattage calculé: ${abattage.toLocaleString()} F CFA`
    });
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Calculateur d'Abattage Fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseValue">Valeur de Base (F CFA)</Label>
            <Input
              type="text"
              id="baseValue"
              inputMode="numeric"
              placeholder="Entrez la valeur de base"
              value={baseValue}
              onChange={(e) => setBaseValue(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deductibles">Déductibles (F CFA)</Label>
            <Input
              type="text"
              id="deductibles"
              inputMode="numeric"
              placeholder="Entrez les déductibles"
              value={deductibles}
              onChange={(e) => setDeductibles(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleCalculate} 
          className="w-full sm:w-auto"
          disabled={!baseValue}
        >
          Calculer l'Abattage
        </Button>
        
        {calculationResult && (
          <TaxResultDisplay
            amount={calculationResult.taxAmount}
            details={calculationResult.details}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default AbattageCalculator;
