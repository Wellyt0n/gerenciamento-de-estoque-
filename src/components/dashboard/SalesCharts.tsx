import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useInventory } from "@/contexts/InventoryContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ChartPeriod = "day" | "week" | "month" | "year";

const SalesCharts = () => {
  const { sales, getSalesByPeriod } = useInventory();
  const [period, setPeriod] = useState<ChartPeriod>("week");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const periodSales = getSalesByPeriod(period);
    const groupedData = new Map();

    periodSales.forEach((sale) => {
      const date = format(
        sale.date,
        period === "day" ? "HH:00" : period === "week" ? "EEE" : "dd/MM",
        { locale: ptBR },
      );

      const existing = groupedData.get(date) || {
        date,
        vendas: 0,
        receita: 0,
        lucro: 0,
      };

      existing.vendas += sale.quantity;
      existing.receita += sale.totalPrice;
      existing.lucro += (sale.salePrice - sale.totalPrice) * sale.quantity;

      groupedData.set(date, existing);
    });

    setChartData(Array.from(groupedData.values()));
  }, [sales, period]);

  return (
    <Card className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Análise de Vendas</h2>
        <Select
          value={period}
          onValueChange={(value: ChartPeriod) => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hoje</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="line" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="line">Gráfico Linear</TabsTrigger>
          <TabsTrigger value="bar">Gráfico de Barras</TabsTrigger>
        </TabsList>

        <TabsContent value="line">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#8884d8"
                  name="Quantidade"
                />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#82ca9d"
                  name="Receita (R$)"
                />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke="#ffc658"
                  name="Lucro (R$)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="bar">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#8884d8" name="Quantidade" />
                <Bar dataKey="receita" fill="#82ca9d" name="Receita (R$)" />
                <Bar dataKey="lucro" fill="#ffc658" name="Lucro (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SalesCharts;
