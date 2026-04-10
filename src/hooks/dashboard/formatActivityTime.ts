
export const formatActivityTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    if (diffInHours <= 1) {
      return "Il y a 1 heure";
    } else {
      return `Il y a ${diffInHours} heures`;
    }
  } else if (diffInHours < 48) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Hier à ${hours}:${minutes}`;
  } else {
    return date.toLocaleDateString('fr-FR');
  }
};
