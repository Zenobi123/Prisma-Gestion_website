
export const generateVisitData = () => {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil',
    'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  // Date à partir de laquelle démarrer les statistiques réelles
  const statsStart = new Date(2025, 3, 21); // Avril = 3, JS date (month 0-based)
  const currentDate = new Date();
  const visitData = [];

  // Créer un tableau de mois entre statsStart et aujourd'hui
  const temp = new Date(statsStart.getFullYear(), statsStart.getMonth(), 1);
  while (
    temp.getFullYear() < currentDate.getFullYear() ||
    (temp.getFullYear() === currentDate.getFullYear() && temp.getMonth() <= currentDate.getMonth())
  ) {
    // Afficher le mois seulement si c'est après le 21/04/2025
    let visitsPerMonth = 0;
    // Si mois = Avril 2025, ne compter qu'à partir du 21
    if (
      temp.getFullYear() > 2025 ||
      (temp.getFullYear() === 2025 && temp.getMonth() > 3)
    ) {
      visitsPerMonth = Math.floor(Math.random() * 400) + 300;
    } else if (temp.getFullYear() === 2025 && temp.getMonth() === 3) {
      // Avril 2025 - partiel car à partir du 21
      visitsPerMonth = Math.floor(Math.random() * 200) + 100;
    }

    visitData.push({
      name: months[temp.getMonth()],
      visits: visitsPerMonth
    });

    // Passer au mois suivant
    temp.setMonth(temp.getMonth() + 1);
  }

  return visitData;
};
