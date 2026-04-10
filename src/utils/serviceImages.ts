export const getServiceImage = (id: string): string => {
  const imageMap: Record<string, string> = {
    'comptabilite': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=70',
    'accounting': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=70',
    'finance': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&q=70',
    'fiscalite': 'https://images.unsplash.com/photo-1554224154-26032ff26273?auto=format&fit=crop&w=1200&q=70',
    'tax': 'https://images.unsplash.com/photo-1554224154-26032ff26273?auto=format&fit=crop&w=1200&q=70',
    'ressources-humaines': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
    'hr': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70',
    'genie-logiciel': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=70',
    'intelligence-artificielle': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=70'
  };
  return imageMap[id] || '/placeholder.svg';
};
