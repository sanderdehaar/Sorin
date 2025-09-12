export const calculateChange = (data: number[], isPercentage = true, unit?: string) => {
  if (!data.length) return { latest: 0, change: 0 };

  const latest = data[data.length - 1];
  let change = 0;

  const usePercentage = isPercentage || unit === undefined || unit === '';

  if (data.length === 2) {
    change = usePercentage
      ? ((data[1] - data[0]) / data[0]) * 100
      : data[1] - data[0];
  } else if (data.length > 2) {
    const previousAvg =
      data.slice(0, -1).reduce((sum, val) => sum + val, 0) / (data.length - 1);
    change = usePercentage
      ? ((latest - previousAvg) / previousAvg) * 100
      : latest - previousAvg;
  }

  return { latest, change };
};