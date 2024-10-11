'use client';

import LineChart from '@/components/Charts/Line.chart';
import { transparentize } from '@/utility/transparentize';
import React, { useEffect, useState } from 'react';
import { GraphsData } from './Graphs';

interface SalesByMonthGraphProps {
  loading: boolean;
  data: GraphsData['salesByMonth'];
  className?: string;
}

interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string | string[];
    borderWidth?: number | number[];
    tension: number;
    fill: boolean;
    type: 'line';
    order: number;
  }[];
}

const SalesByMonthGraph: React.FC<SalesByMonthGraphProps> = ({
  loading,
  data,
  className,
}) => {
  const [graphData, setGraphData] = useState<LineChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const dataLabels: string[] = Object.keys(data).map(monthName => {
      const [month, year] = monthName.split('-'); // Split by hyphen
      return `${month} '${year.slice(-2)}`; // Format: Month 'YY
    });

    setGraphData({
      labels: dataLabels,
      datasets: [
        {
          label: 'Sales',
          data: Object.values(data),
          backgroundColor: transparentize('#4169e1'),
          borderColor: '#1c318f',
          borderWidth: 2,
          fill: true, // Fill the area under the line
          tension: 0.3,
          type: 'line',
          order: 0,
        },
      ],
    });
  }, [data]);

  return (
    <div>
      {loading ? <p className="text-center">Loading...</p> : null}
      {!loading && (
        <LineChart
          className={className || ''}
          chartData={graphData}
          showLegend={false}
        />
      )}
    </div>
  );
};

export default SalesByMonthGraph;
