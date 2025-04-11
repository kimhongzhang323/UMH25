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
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderVolumeChart = ({ data }) => {
  // Format dates to be more readable (e.g., "Apr 03")
  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMM dd');
  };

  const chartData = {
    labels: data.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Number of Orders',
        data: data.map(item => item.orders),
        borderColor: '#3B82F6', // Blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#3B82F6',
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
          title: (context) => {
            const date = parseISO(data[context[0].dataIndex].date);
            return format(date, 'EEEE, MMMM d'); // E.g., "Wednesday, April 3"
          },
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

export default OrderVolumeChart;