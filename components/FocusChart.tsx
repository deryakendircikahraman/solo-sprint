import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FocusChartProps {
  focusPercentage: number;
  distractionPercentage: number;
  type: 'bar' | 'doughnut';
}

export default function FocusChart({ focusPercentage, distractionPercentage, type }: FocusChartProps) {
  const data = {
    labels: ['Focused', 'Distracted'],
    datasets: [
      {
        data: [focusPercentage, distractionPercentage],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue for focus
          'rgba(239, 68, 68, 0.8)',  // Red for distraction
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Focus vs Distraction',
      },
    },
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-calm-900 mb-4">Focus Analytics</h2>
      <div className="h-64">
        {type === 'doughnut' ? (
          <Doughnut data={data} options={options} />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
} 