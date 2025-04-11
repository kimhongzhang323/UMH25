import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PeakHoursChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => {
      const hour = item.hour % 12 || 12;
      const ampm = item.hour < 12 ? 'AM' : 'PM';
      return `${hour}${ampm}`;
    }),
    datasets: [
      {
        label: 'Number of Orders',
        data: data.map(item => item.orders),
        borderColor: '#8B5CF6', // Violet-500
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#8B5CF6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151', // Gray-700
          font: {
            size: 14,
            weight: '500'
          },
          padding: 20,
          boxWidth: 12,
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#111827', // Gray-900
        bodyColor: '#374151', // Gray-700
        borderColor: '#E5E7EB', // Gray-200
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `Orders: ${context.raw}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280', // Gray-500
          font: {
            size: 12
          }
        },
      },
      y: {
        grid: {
          color: '#E5E7EB', // Gray-200
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280', // Gray-500
          font: {
            size: 12
          },
          stepSize: 10,
          padding: 10,
        },
        min: 0,
      },
    },
    elements: {
      line: {
        cubicInterpolationMode: 'monotone'
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PeakHoursChart;