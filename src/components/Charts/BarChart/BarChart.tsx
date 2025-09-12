import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import './BarChart.css';
import { getBatteryColor } from '../../../utils/batteryColor';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null | undefined)[]; 
    backgroundColor?: string | string[]; 
  }[];
  Battery?: boolean;
  unit: string;
}

const BarChart: React.FC<BarChartProps> = ({ labels, datasets, Battery = false, unit }) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      backgroundColor: ds.data.map((value, index) => {
        if (value === null || value === undefined) {
          return '#f2f2f2';
        }
        if (Battery) {
          return getBatteryColor(value);
        }
        return index % 2 === 0 ? '#f2f2f2' : '#6EB276';
      }),
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}${unit}`,
        },
      },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
