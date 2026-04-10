
export const calculateTotalVisits = (
  visitData: { name: string; visits: number }[]
) => {
  return visitData.reduce((total, month) => total + month.visits, 0);
};
