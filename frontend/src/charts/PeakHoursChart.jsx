
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
  // Format the data for Chart.js
  const chartData = {
    labels: data.map(item => {
      // Convert 24-hour format to 12-hour AM/PM format
      const hour = item.hour % 12 || 12;
      const ampm = item.hour < 12 ? 'AM' : 'PM';
      return `${hour}${ampm}`;
    }),
    datasets: [
      {
        label: 'Number of Orders',
        data: data.map(item => item.orders),
        borderColor: '#4f46e5', // Purple
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0',
        },
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#a5b4fc',
        bodyColor: '#e0e0e0',
        borderColor: '#4f46e5',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e0e0e0',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e0e0e0',
          stepSize: 10,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container" style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PeakHoursChart;