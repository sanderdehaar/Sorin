import { FIXED_DATE } from '../constants';

export const getLastWeekDateRange = () => {
  const lastWeekStart = new Date(FIXED_DATE);
  lastWeekStart.setDate(FIXED_DATE.getDate() - 7);
  
  const lastWeekEnd = new Date(FIXED_DATE);
  
  return { lastWeekStart, lastWeekEnd };
};

import type { Measurement } from '../hooks/useSensors';

export const mapSoilMoistureData = (measurements: Measurement[]) => ({
  labels: measurements.filter((m) => m.type === 'soil_moisture').map((m) => new Date(m.measured_at).toLocaleString()),
  unit: '%',
  datasets: [{
    label: 'Soil Moisture',
    data: measurements.filter((m) => m.type === 'soil_moisture').map((m) => parseFloat(m.value.toString())),
  }],
});

export const mapSoilPhData = (measurements: Measurement[]) => ({
  labels: measurements.filter((m) => m.type === 'soil_ph').map((m) => new Date(m.measured_at).toLocaleString()),
  unit: 'pH',
  datasets: [{
    label: 'Soil pH',
    data: measurements.filter((m) => m.type === 'soil_ph').map((m) => parseFloat(m.value.toString())),
  }],
});

export const mapNutrientData = (measurements: Measurement[]) => {
  const getLatestNpkValueUpToDate = (date: Date) => {
    const targetTime = date.setHours(23, 59, 59, 999);
    const filtered = measurements
      .filter((m) => m.type === 'nutrient_npk' && new Date(m.measured_at).getTime() <= targetTime)
      .sort((a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime());
    return filtered.length > 0 ? filtered[filtered.length - 1].value : 0;
  };

  const fixedDate = new Date(FIXED_DATE);
  const lastWeekDate = new Date(FIXED_DATE);
  lastWeekDate.setDate(fixedDate.getDate() - 7);

  const nutrientTotalThisWeek = getLatestNpkValueUpToDate(new Date(fixedDate));
  const nutrientTotalLastWeek = getLatestNpkValueUpToDate(new Date(lastWeekDate));

  return {
    labels: ['This Week', 'Last Week'],
    data: [nutrientTotalThisWeek, nutrientTotalLastWeek],
    unit: 'ppm',
  };
};