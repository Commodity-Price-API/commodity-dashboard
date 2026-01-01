import React, { forwardRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeSeriesChart = forwardRef(({ datasets }, ref) => {
  if (!datasets || datasets.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Waiting for data...</div>;
  }

  const data = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'nearest', intersect: false }
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        title: { display: true, text: 'Date' }
      },
      yGold: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Gold Price (USD)' }
      },
      yOil: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Oil Price (USD)' }
      }
    }
  };

  return (
    <div style={{ height: '420px', width: '100%' }}>
      <Line ref={ref} data={data} options={options} />
    </div>
  );
});

export default TimeSeriesChart;
