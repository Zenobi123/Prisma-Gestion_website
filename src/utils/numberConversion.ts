
/**
 * Convertit une chaîne de caractères en nombre
 * @param value La valeur à convertir
 * @param defaultValue La valeur par défaut si la conversion échoue (0 par défaut)
 * @returns Le nombre converti ou la valeur par défaut
 */
export const toNumber = (value: string | number, defaultValue: number = 0): number => {
  if (value === undefined || value === null) return defaultValue;
  
  // Si c'est déjà un nombre, on le retourne
  if (typeof value === 'number') return value;
  
  // Formatage de la chaîne: suppression des espaces et remplacement de la virgule par un point
  const formatted = value.toString().trim().replace(/\s/g, '').replace(',', '.');
  
  // Conversion en nombre
  const result = Number(formatted);
  
  // Si c'est un nombre valide, on le retourne, sinon on retourne la valeur par défaut
  return !isNaN(result) ? result : defaultValue;
};

/**
 * Vérifie si une valeur est un nombre valide
 * @param value La valeur à vérifier
 * @returns true si c'est un nombre valide, false sinon
 */
export const isValidNumber = (value: string | number | undefined | null): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'number') return !isNaN(value);
  const formatted = value.toString().trim().replace(/\s/g, '').replace(',', '.');
  return !isNaN(Number(formatted));
};
