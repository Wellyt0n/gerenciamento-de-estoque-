import React from "react";
import MetricsGrid from "./dashboard/MetricsGrid";
import ProductsTable from "./dashboard/ProductsTable";
import SalesCharts from "./dashboard/SalesCharts";
import StockAlert from "./alerts/StockAlert";
import { useInventory } from "@/contexts/InventoryContext";

function Home() {
  const { metrics, products, getLowStockProducts } = useInventory();
  const lowStockProducts = getLowStockProducts(10);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Gestão de Estoque</h1>

        <div className="space-y-6">
          <MetricsGrid metrics={metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductsTable products={products} />
            </div>
            <div className="space-y-6">
              {lowStockProducts.map((product) => (
                <StockAlert
                  key={product.id}
                  productName={product.name}
                  currentStock={product.quantity}
                  threshold={10}
                />
              ))}
              <SalesCharts />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
