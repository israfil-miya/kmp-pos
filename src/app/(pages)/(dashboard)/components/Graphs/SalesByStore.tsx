'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface SalesByStoreGraphProps {
  loading: boolean;
  data: Record<string, number>;
  className?: string;
}

export default function SalesByStoreGraph({
  loading,
  data,
  className,
}: SalesByStoreGraphProps) {
  const chartData = Object.entries(data)
    .map(([store, sales]) => ({
      store: store.charAt(0).toUpperCase() + store.slice(1),
      sales,
    }))
    .sort((a, b) => b.sales - a.sales);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className={`w-full ${className}`}>
      <ChartContainer
        config={{
          sales: {
            label: 'sales',
            color: 'hsl(var(--chart-1))',
          },
        }}
      >
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="store" type="category" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="sales"
            fill="var(--color-sales)"
            radius={[0, 8, 8, 0]}
            label={{
              position: 'right',
              fill: 'hsl(var(--foreground))',
              fontSize: 12,
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
