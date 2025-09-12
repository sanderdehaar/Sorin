import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './LineChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ labels, datasets }) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor || '#66B6F0',
      borderWidth: ds.borderWidth || 6,
      pointRadius: 0,
      tension: 0.6,
      fill: false,
    })),
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'nearest',
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    elements: { line: { tension: 0.3 } },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;