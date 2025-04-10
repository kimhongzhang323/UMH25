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
        borderColor: '#10b981', // Emerald green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
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
        borderColor: '#10b981',
        borderWidth: 1,
        callbacks: {
          title: (context) => {
            const date = parseISO(data[context[0].dataIndex].date);
            return format(date, 'EEEE, MMMM d'); // E.g., "Wednesday, April 3"
          },
        },
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
        min: 0, // Start y-axis at 0
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

export default OrderVolumeChart;