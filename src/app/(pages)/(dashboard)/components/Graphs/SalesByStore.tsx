'use client';

import BarChart from '@/components/Charts/Bar.horizontal.chart';
import { transparentize } from '@/utility/transparentize';
import React, { useEffect, useState } from 'react';
import { GraphsData } from './Graphs';

interface SalesByStoreGraphProps {
  loading: boolean;
  data: GraphsData['salesByStore'];
  className?: string;
}

interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string | string[];
    borderWidth?: number | number[];
    type: 'bar';
    axis: 'y';
  }[];
}

const SalesByStoreGraph: React.FC<SalesByStoreGraphProps> = ({
  loading,
  data,
  className,
}) => {
  const [graphData, setGraphData] = useState<BarChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const dataLabels: string[] = Object.keys(data).map(storeName => {
      return storeName.charAt(0).toUpperCase() + storeName.slice(1); // Format as "MMM DD"
    });

    setGraphData({
      labels: dataLabels, // This holds the labels (e.g., "Sep", "Oct")
      datasets: [
        {
          label: 'Sales',
          axis: 'y',
          data: Object.values(data), // Get sales data for each label
          backgroundColor: [
            transparentize('rgb(255, 99, 132)'),
            transparentize('rgb(255, 159, 64)'),
            transparentize('rgb(255, 205, 86)'),
            transparentize('rgb(75, 192, 192)'),
            transparentize('rgb(54, 162, 235)'),
            transparentize('rgb(153, 102, 255)'),
            transparentize('rgb(201, 203, 207)'),
          ],
          borderColor: [
            'rgb(204, 79, 105)',
            'rgb(204, 127, 51)',
            'rgb(204, 164, 69)',
            'rgb(60, 154, 154)',
            'rgb(43, 130, 188)',
            'rgb(122, 82, 204)',
            'rgb(161, 162, 165)',
          ],
          borderWidth: 2,
          type: 'bar',
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

export default SalesByStoreGraph;
