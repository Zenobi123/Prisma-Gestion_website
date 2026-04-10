
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { toNumber } from '@/utils/numberConversion';
import TaxResultDisplay from './TaxResultDisplay';

const IRPPCalculator = () => {
  const [revenuAnnuel, setRevenuAnnuel] = useState('');
  const [charges, setCharges] = useState('');
  const [situationFamiliale, setSituationFamiliale] = useState('celibataire');
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    details: string;
  } | null>(null);

  const handleCalculate = () => {
    const revenuAnnuelNum = toNumber(revenuAnnuel);
    const chargesNum = toNumber(charges);
    
    // Calcul simplifié pour l'IRPP au Cameroun
    const revenuImposable = Math.max(0, revenuAnnuelNum - chargesNum);
    
    // Facteurs basés sur la situation familiale
    let facteur = 1;
    if (situationFamiliale === 'marie') facteur = 0.9;
    if (situationFamiliale === 'enfants') facteur = 0.8;
    
    // Taux d'imposition progressif simplifié
    let tauxImposition = 0.1; // 10% par défaut
    if (revenuImposable > 2000000) tauxImposition = 0.15;
    if (revenuImposable > 5000000) tauxImposition = 0.25;
    if (revenuImposable > 10000000) tauxImposition = 0.35;
    
    const montantIRPP = Math.round(revenuImposable * tauxImposition * facteur);
    
    setCalculationResult({
      taxAmount: montantIRPP,
      details: `Revenu annuel: ${revenuAnnuelNum.toLocaleString()} F CFA\nCharges déductibles: ${chargesNum.toLocaleString()} F CFA\nRevenu imposable: ${revenuImposable.toLocaleString()} F CFA\nTaux d'imposition: ${Math.round(tauxImposition * 100)}%\nMontant IRPP: ${montantIRPP.toLocaleString()} F CFA`
    });
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Calculateur IRPP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="revenuAnnuel">Revenu Annuel (F CFA)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="revenuAnnuel"
              inputMode="numeric"
              placeholder="Entrez votre revenu annuel"
              value={revenuAnnuel}
              onChange={(e) => setRevenuAnnuel(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="charges">Charges Déductibles (F CFA)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="charges"
              inputMode="numeric"
              placeholder="Entrez vos charges déductibles"
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="situationFamiliale">Situation Familiale</Label>
            <Select value={situationFamiliale} onValueChange={setSituationFamiliale}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre situation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celibataire">Célibataire</SelectItem>
                <SelectItem value="marie">Marié(e)</SelectItem>
                <SelectItem value="enfants">Marié(e) avec enfants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleCalculate} 
          className="w-full sm:w-auto"
          disabled={!revenuAnnuel}
        >
          Calculer l'IRPP
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

export default IRPPCalculator;
