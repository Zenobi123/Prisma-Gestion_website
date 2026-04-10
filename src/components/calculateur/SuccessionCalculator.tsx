
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { toNumber } from '@/utils/numberConversion';
import TaxResultDisplay from './TaxResultDisplay';

const SuccessionCalculator = () => {
  const [valeurSuccession, setValeurSuccession] = useState('');
  const [typeHeritier, setTypeHeritier] = useState('directe');
  const [calculationResult, setCalculationResult] = useState<{
    taxAmount: number;
    details: string;
  } | null>(null);

  const handleCalculate = () => {
    const valeurSuccessionNum = toNumber(valeurSuccession);
    
    // Taux d'imposition basé sur le type d'héritier
    let tauxImposition = 0;
    switch (typeHeritier) {
      case 'directe':
        tauxImposition = 0.05; // 5% pour les héritiers directs
        break;
      case 'conjoint':
        tauxImposition = 0.07; // 7% pour les conjoints
        break;
      case 'collaterale':
        tauxImposition = 0.10; // 10% pour les collatéraux
        break;
      case 'autres':
        tauxImposition = 0.15; // 15% pour les autres héritiers
        break;
      default:
        tauxImposition = 0.05;
    }
    
    const droitsSuccession = Math.round(valeurSuccessionNum * tauxImposition);
    const montantNet = valeurSuccessionNum - droitsSuccession;
    
    setCalculationResult({
      taxAmount: droitsSuccession,
      details: `Valeur de la succession: ${valeurSuccessionNum.toLocaleString()} F CFA\nType d'héritier: ${getHeritierLabel(typeHeritier)}\nTaux d'imposition: ${Math.round(tauxImposition * 100)}%\nDroits de succession: ${droitsSuccession.toLocaleString()} F CFA\nMontant net: ${montantNet.toLocaleString()} F CFA`
    });
  };

  const getHeritierLabel = (type: string) => {
    switch (type) {
      case 'directe': return 'Héritier direct (enfants, parents)';
      case 'conjoint': return 'Conjoint survivant';
      case 'collaterale': return 'Collatéral (frères, sœurs)';
      case 'autres': return 'Autres héritiers';
      default: return type;
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Calculateur de Droits de Succession</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="valeurSuccession">Valeur de la Succession (F CFA)</Label>
              <HelpCircle size={16} className="text-muted-foreground cursor-help" />
            </div>
            <Input
              type="text"
              id="valeurSuccession"
              inputMode="numeric"
              placeholder="Entrez la valeur de la succession"
              value={valeurSuccession}
              onChange={(e) => setValeurSuccession(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="typeHeritier">Type d'Héritier</Label>
            <Select value={typeHeritier} onValueChange={setTypeHeritier}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type d'héritier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="directe">Héritier direct (enfants, parents)</SelectItem>
                <SelectItem value="conjoint">Conjoint survivant</SelectItem>
                <SelectItem value="collaterale">Collatéral (frères, sœurs)</SelectItem>
                <SelectItem value="autres">Autres héritiers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleCalculate} 
          className="w-full sm:w-auto"
          disabled={!valeurSuccession}
        >
          Calculer les Droits de Succession
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

export default SuccessionCalculator;
