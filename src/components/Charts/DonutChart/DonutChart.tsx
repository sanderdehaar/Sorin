import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import './DonutChart.css';

ChartJS.register(ArcElement, Tooltip);

interface DonutChartProps {
  labels: string[];
  data: number[];
  backgroundColors?: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ labels, data, backgroundColors }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors || ['#578B5D', '#6EB276', '#ABD2B0'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: '60%',
  };

  return (
    <div className="donut-chart__container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DonutChart;