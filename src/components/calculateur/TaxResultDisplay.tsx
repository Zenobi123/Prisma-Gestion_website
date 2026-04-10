
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TaxResultProps {
  result?: {
    classe: number;
    montant: number;
    tdl?: number;
    total?: number;
    chiffreAffaires: number;
    minRange: number;
    maxRange: number;
    message?: string;
  };
  amount?: number;
  details?: string;
}

const TaxResultDisplay = ({ result, amount, details }: TaxResultProps) => {
  // If we have result object (for IGS calculator)
  if (result) {
    // Formatteur pour les nombres en F CFA
    const formatCurrency = (amount: number) => {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " F CFA";
    };

    // Fonction pour afficher la fourchette
    const formatRange = () => {
      if (result.classe === 1) {
        return `Moins de ${formatCurrency(result.maxRange)}`;
      } else {
        return `De ${formatCurrency(result.minRange)} à ${formatCurrency(result.maxRange)}`;
      }
    };

    return (
      <Card className="mt-6 border-2 border-prisma-purple/20">
        <CardContent className="p-4 xs:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
            <h3 className="text-lg xs:text-xl font-semibold text-prisma-purple">Résultat du calcul</h3>
            <span className="text-gray-500 text-xs xs:text-sm">
              Pour un chiffre d'affaires de {formatCurrency(result.chiffreAffaires)}
            </span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 mt-4">
            <div className="bg-prisma-light-gray p-3 xs:p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Classe</div>
              <div className="text-xl sm:text-2xl font-bold text-prisma-purple">{result.classe}</div>
            </div>
            
            <div className="bg-prisma-light-gray p-3 xs:p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">Fourchette</div>
              <div className="text-[10px] xs:text-xs sm:text-sm font-medium break-words">{formatRange()}</div>
            </div>
            
            <div className="bg-prisma-light-gray p-3 xs:p-4 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500 mb-1">IGS (Principal)</div>
              <div className="text-base xs:text-lg sm:text-xl font-bold text-prisma-purple break-all sm:break-normal">{formatCurrency(result.montant)}</div>
            </div>

            {result.tdl !== undefined && (
              <div className="bg-prisma-light-gray p-3 xs:p-4 rounded-lg border-l-4 border-amber-400">
                <div className="text-xs sm:text-sm text-gray-500 mb-1">TDL (10% IGS)</div>
                <div className="text-base xs:text-lg sm:text-xl font-bold text-amber-600 break-all sm:break-normal">{formatCurrency(result.tdl)}</div>
              </div>
            )}
          </div>

          {result.total !== undefined && (
            <div className="mt-4 bg-green-50 p-4 sm:p-6 rounded-lg border-2 border-green-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-base sm:text-lg font-semibold text-green-800">Total à payer (IGS + TDL)</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-700 break-all">{formatCurrency(result.total)}</div>
              </div>
            </div>
          )}

          {result.message && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              {result.message}
            </div>
          )}

          <p className="mt-6 text-sm text-gray-500">
            Ce calcul est basé sur les barèmes actuellement en vigueur au Cameroun pour l'Impôt Global Synthétique. Pour des conseils personnalisés en fiscalité, comptabilité ou gestion, PRISMA GESTION se tient à votre disposition. Contactez nos experts pour un accompagnement adapté à votre situation.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // For other calculators that use amount and details
  if (amount !== undefined && details) {
    return (
      <div className="px-4 py-3 bg-prisma-light-gray rounded-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Montant calculé:</span>
            <div className="text-xl font-bold text-green-600">
              {amount.toLocaleString()} F CFA
            </div>
          </div>
          <button
            type="button"
            className="text-xs text-gray-500 hover:text-prisma-purple mt-2 md:mt-0"
            title="Détail du calcul"
            onClick={() => alert(details)}
          >
            Voir le détail
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TaxResultDisplay;
