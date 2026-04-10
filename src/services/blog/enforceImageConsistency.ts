
// Toute la cohérence est désormais gérée automatiquement côté base (trigger)
export const enforceImagesConsistency = async (): Promise<void> => {
  // La synchronisation est garantie dès insertion/update par trigger SQL
  return;
};
