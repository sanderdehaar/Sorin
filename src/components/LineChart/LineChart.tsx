import React, { useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { ChartOptions } from 'chart.js'
import './LineChart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export type LineChartDataset = {
  label: string
  data: (number | null)[]
  borderColor: string
}

interface LineChartProps {
  labels: string[]
  datasets: LineChartDataset[]
}

const defaultMaxValues: Record<string, number> = {
  Temperature: 100,
  Humidity: 100,
  Pressure: 1200,
}

const LineChart: React.FC<LineChartProps> = ({ labels, datasets }) => {
  const chartRef = useRef<any>(null)

  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      fill: true,
      tension: 0.4,
      borderWidth: 5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: ds.borderColor,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart
        const { ctx: canvasCtx, chartArea } = chart
        if (!chartArea) return ds.borderColor

        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, `${ds.borderColor}33`)
        gradient.addColorStop(1, `${ds.borderColor}00`)
        return gradient
      },
    })),
  }

  const fixedMax = datasets.length
    ? Math.max(...datasets.map((ds) => defaultMaxValues[ds.label] ?? 100))
    : 100

  // Calculate step size to ensure exactly 5 intervals between 0 and max
  const numberOfIntervals = 5
  const stepSize = Math.ceil(fixedMax / numberOfIntervals)
  // Round up the max value to the nearest multiple of stepSize
  const roundedMax = Math.ceil(fixedMax / stepSize) * stepSize

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: '#292929',
        titleColor: '#DEDEDE',
        bodyColor: '#DEDEDE',
      },
    },
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: roundedMax,
        ticks: {
          color: '#DEDEDE',
          font: { size: 14, family: 'secondaryFont' },
          padding: 30,
          stepSize: stepSize,
          callback: (value) => Number(value).toFixed(0),
        },
        grid: { color: 'transparent', drawTicks: false },
      },
      x: {
        ticks: {
          color: '#DEDEDE',
          font: { size: 14, family: 'secondaryFont' },
          padding: 30,
          maxRotation: 90,
          minRotation: 90,
        },
        grid: { drawTicks: false, drawOnChartArea: true, color: '#2E2E2E' },
      },
    },
    elements: {
      line: { tension: 1, borderWidth: 5 },
      point: { radius: 0, hoverRadius: 6 },
    },
  }

  return (
    <div className="chart-container">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  )
}

export default LineChart