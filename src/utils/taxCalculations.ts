
// Données des tranches d'imposition
const taxClasses = [
  { classe: 1, min: 0, max: 499_999, montant: 20_000 },
  { classe: 2, min: 500_000, max: 999_999, montant: 30_000 },
  { classe: 3, min: 1_000_000, max: 1_499_999, montant: 40_000 },
  { classe: 4, min: 1_500_000, max: 1_999_999, montant: 50_000 },
  { classe: 5, min: 2_000_000, max: 2_499_999, montant: 60_000 },
  { classe: 6, min: 2_500_000, max: 4_999_999, montant: 150_000 },
  { classe: 7, min: 5_000_000, max: 9_999_999, montant: 300_000 },
  { classe: 8, min: 10_000_000, max: 19_999_999, montant: 500_000 },
  { classe: 9, min: 20_000_000, max: 29_999_999, montant: 1_000_000 },
  { classe: 10, min: 30_000_000, max: 49_999_999, montant: 2_000_000 },
];

/**
 * Calcule la classe d'imposition et le montant de l'IGS à payer
 * @param chiffreAffaires - Le chiffre d'affaires annuel
 * @returns Objet contenant la classe, le montant, et les informations sur la tranche
 */
export const calculateTaxClass = (chiffreAffaires: number) => {
  // Trouver la classe correspondante au chiffre d'affaires
  const taxClass = taxClasses.find((taxClass) => 
    chiffreAffaires >= taxClass.min && chiffreAffaires <= taxClass.max
  );
  
  // Si aucune classe ne correspond (par exemple, si CA > 50M), retourner une valeur spéciale
  if (!taxClass) {
    // Si le CA dépasse les 50M, on n'est plus éligible à l'IGS
    if (chiffreAffaires > taxClasses[taxClasses.length - 1].max) {
      return {
        classe: 0,
        montant: 0,
        chiffreAffaires,
        minRange: 0, 
        maxRange: 0,
        message: "Vous n'êtes plus éligible au régime de l'IGS. Veuillez vous référer au régime du réel."
      };
    }
    
    return {
      classe: 0,
      montant: 0,
      chiffreAffaires,
      minRange: 0, 
      maxRange: 0,
      message: "Erreur de calcul. Veuillez vérifier votre chiffre d'affaires."
    };
  }
  
  // Calculer la Taxe de Développement Local (TDL) - 10% de l'IGS
  const tdl = Math.round(taxClass.montant * 0.10);
  const total = taxClass.montant + tdl;

  // Retourner les informations de la classe trouvée
  return {
    classe: taxClass.classe,
    montant: taxClass.montant,
    tdl,
    total,
    chiffreAffaires,
    minRange: taxClass.min,
    maxRange: taxClass.max
  };
};
