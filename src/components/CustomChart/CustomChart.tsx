import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';
import './CustomChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface CustomChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

const CustomChart: React.FC<CustomChartProps> = ({ labels, datasets }) => {
  const chartData = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor || '#66B6F0',
      borderWidth: ds.borderWidth || 6,
      pointRadius: 2,
      tension: 0.2,
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        intersect: false,
        mode: 'nearest' as const,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default CustomChart;