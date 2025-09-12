import { FIXED_DATE } from '../constants';

export const formatDate = (date: Date = FIXED_DATE): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTime = (date: Date = FIXED_DATE): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',  // "Mon"
    year: 'numeric',   // "2025"
    month: 'short',    // "Sep"
    day: 'numeric',    // "8"
    hour: '2-digit',   // "12"
    minute: '2-digit', // "00"
    hour12: true,      // AM/PM format
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export const getNpkValue = (measurements: any[], date: Date = FIXED_DATE): number => {
  const formattedDate = formatDate(date);
  const filteredData = measurements.filter(
    (m) => m.type === 'nutrient_npk' && formatDate(new Date(m.measured_at)) === formattedDate
  );
  return filteredData[filteredData.length - 1]?.value || 0;
};

export const getLastWeekDate = (date: Date = FIXED_DATE): Date => {
  const lastWeekDate = new Date(date);
  lastWeekDate.setDate(date.getDate() - 7);
  return lastWeekDate;
};