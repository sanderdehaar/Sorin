export const getBatteryColor = (value: number): string => {
  if (value > 75) return '#4CAF50';
  if (value > 20) return '#FF9800';
  return '#F44336';
};