export const getServiceImage = (id: string): string => {
  const imageMap: Record<string, string> = {
    'comptabilite': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    'accounting': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    'finance': '/images/services/finance-cameroon.jpg',
    'fiscalite': '/images/services/fiscalite-cameroon.jpg',
    'tax': '/images/services/fiscalite-cameroon.jpg',
    'ressources-humaines': '/images/services/rh-cameroon.jpg',
    'hr': '/images/services/rh-cameroon.jpg',
    'genie-logiciel': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    'intelligence-artificielle': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
  };
  return imageMap[id] || '/placeholder.svg';
};
