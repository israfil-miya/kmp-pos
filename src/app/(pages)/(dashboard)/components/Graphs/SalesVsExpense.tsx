'use client';

import BarChart from '@/components/Charts/Bar.chart';
import { transparentize } from '@/utility/transparentize';
import React, { useEffect, useState } from 'react';
import { GraphsData } from './Graphs';

interface SalesVsExpenseGraphProps {
  loading: boolean;
  data: GraphsData['salesVsExpenses'];
  className?: string;
}

interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
    borderWidth?: number | number[];
    type: 'bar';
    order: number;
  }[];
}

const SalesVsExpenseGraph: React.FC<SalesVsExpenseGraphProps> = ({
  loading,
  data,
  className,
}) => {
  const [graphData, setGraphData] = useState<BarChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const dataLabels: string[] = Object.keys(data).map(monthName => {
      const [month, day] = monthName.split('-');
      return `${month} ${day.padStart(2, '0')}`; // Format as "MMM DD"
    });

    setGraphData({
      labels: dataLabels, // This holds the labels (e.g., "Sep", "Oct")
      datasets: [
        {
          label: 'Sales',
          data: Object.keys(data).map(key => data[key].sales), // Get sales data for each label
          backgroundColor: transparentize('rgb(54, 162, 235)'), // Set the color for sales bars
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
          type: 'bar',
          order: 0,
        },
        {
          label: 'Expenses',
          data: Object.keys(data).map(key => data[key].expenses), // Get expenses data for each label
          backgroundColor: transparentize('rgb(255, 99, 132)'), // Set the color for expenses bars
          borderColor: transparentize('rgb(255, 99, 132)'),
          borderWidth: 2,
          type: 'bar',
          order: 1,
        },
      ],
    });
  }, [data]);

  return (
    <div>
      {loading ? <p className="text-center">Loading...</p> : null}
      {!loading && (
        <BarChart
          className={className || ''}
          chartData={graphData}
          showLegend={false}
        />
      )}
    </div>
  );
};

export default SalesVsExpenseGraph;
