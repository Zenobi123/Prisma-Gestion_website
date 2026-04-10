export const getServiceImage = (id: string): string => {
  const imageMap: Record<string, string> = {
    'comptabilite': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=60',
    'accounting': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=60',
    'finance': 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=600&q=60',
    'fiscalite': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=60',
    'tax': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=60',
    'ressources-humaines': 'https://images.unsplash.com/photo-1573164574472-797cdf4a583a?auto=format&fit=crop&w=600&q=60',
    'hr': 'https://images.unsplash.com/photo-1573164574472-797cdf4a583a?auto=format&fit=crop&w=600&q=60',
    'genie-logiciel': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=60',
    'intelligence-artificielle': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=60'
  };
  return imageMap[id] || '/placeholder.svg';
};
