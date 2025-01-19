import React from "react";
import { Card } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

const MetricCard = ({
  title = "Métrica",
  value = "0",
  icon = <Package />,
  trend,
}: MetricCardProps) => {
  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && <p className="text-sm text-green-600">{trend}</p>}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface MetricsGridProps {
  metrics?: {
    totalStock: number;
    stockValue: number;
    totalSales: number;
    profit: number;
  };
}

const MetricsGrid = ({
  metrics = {
    totalStock: 0,
    stockValue: 0,
    totalSales: 0,
    profit: 0,
  },
}: MetricsGridProps) => {
  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Valor Total em Estoque"
          value={`R$ ${metrics.stockValue.toLocaleString()}`}
          icon={<Package />}
        />
        <MetricCard
          title="Total em Vendas"
          value={`R$ ${metrics.totalSales.toLocaleString()}`}
          icon={<TrendingUp />}
        />
        <MetricCard
          title="Lucro Total"
          value={`R$ ${metrics.profit.toLocaleString()}`}
          icon={<DollarSign />}
        />
      </div>
    </div>
  );
};

export default MetricsGrid;
