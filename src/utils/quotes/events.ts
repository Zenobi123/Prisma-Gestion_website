
// Déclencheur d'événements pour les mises à jour des devis
export function triggerQuoteRequestsUpdated(quotes: any[] = []) {
  console.log(`Déclenchement de l'événement quoteRequestsUpdated avec ${quotes.length} devis`);
  // Utiliser setTimeout pour s'assurer que l'événement est déclenché après que toute autre opération soit terminée
  setTimeout(() => {
    const event = new CustomEvent('quoteRequestsUpdated', { detail: quotes });
    window.dispatchEvent(event);
  }, 0);
}
