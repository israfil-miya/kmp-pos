'use client';

import cn from '@/utility/cn';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import {
  Area,
  CartesianGrid,
  Legend,
  AreaChart as RechartsAreaChart,
  XAxis,
  YAxis,
} from 'recharts';
import { GraphsData } from './Graphs';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface SalesByMonthGraphProps {
  loading: boolean;
  data: GraphsData['salesByMonth'];
  className?: string;
}

const chartConfig = {} satisfies ChartConfig;

const SalesByMonthGraph: React.FC<SalesByMonthGraphProps> = ({
  loading,
  data,
  className,
}) => {
  const [graphData, setGraphData] = useState<{ name: string; sales: number }[]>(
    [],
  );

  useEffect(() => {
    console.log('data', data);

    const dataLabels = Object.keys(data).map(monthYear => {
      return moment(monthYear, 'MMMM-YYYY').format("MMM 'YY"); // Format: "Oct '24"
    });

    setGraphData(() =>
      dataLabels.map((label, index) => ({
        name: label,
        sales: Object.values(data)[index],
      })),
    );
  }, [data]);

  if (loading) {
    <p className="text-center">Loading...</p>;
  }

  return (
    <div className={cn('w-full h-full', className)}>
      <ChartContainer config={chartConfig}>
        <RechartsAreaChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#1c318f"
            fill="#4169e1"
            strokeWidth={2}
            fillOpacity={0.5}
          />
        </RechartsAreaChart>
      </ChartContainer>
    </div>
  );
};

export default SalesByMonthGraph;
