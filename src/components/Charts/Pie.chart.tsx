import cn from '@/utility/cn';
import { ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import React from 'react';
import { Line } from 'react-chartjs-2';

// Registering the datalabels plugin
import { Chart as ChartJS } from 'chart.js/auto';
ChartJS.register(ChartDataLabels);

interface LineChartProps {
  chartData: ChartData<'line'>;
  showLegend?: boolean;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  chartData,
  showLegend,
  className,
}) => {
  const options: ChartOptions<'line'> = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, ctx) => {
          const datapoints: number[] =
            (ctx.chart.data.datasets[0]?.data as number[]) || [];

          const total =
            datapoints?.reduce(
              (total, datapoint) => total + (datapoint || 0),
              0,
            ) ?? 0;

          if (total === 0) return '0%'; // Avoid division by zero

          const percentage = (value / total) * 100;
          return percentage.toFixed(2) + '%';
        },

        font: {
          weight: 'bold',
        },
      },
      legend: {
        position: 'bottom',
        display: showLegend === undefined ? true : showLegend,
        labels: {
          font: {
            weight: 'bold',
            size: 15,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => {
            if (typeof value === 'number') {
              if (value % 1 === 0) {
                return value.toFixed(0); // Display as integer (no decimal)
              } else {
                return value.toFixed(1); // Display with one decimal place
              }
            }
            return value; // Return the value as-is if it's not a number
          },
        },
      },
    },
    layout: {
      padding: {
        top: 50,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className={cn(`h-96`, className)}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
