import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Sale, Expense, Period, DashboardMetrics } from "@/types";

interface InventoryContextType {
  // Products
  products: Product[];
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Sales
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id" | "date">) => void;
  getSalesByPeriod: (period: Period) => Sale[];

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id" | "date">) => void;
  getExpensesByPeriod: (period: Period) => Expense[];

  // Metrics
  metrics: DashboardMetrics;
  calculateProfit: (period: Period) => number;
  calculateStockValue: () => number;
  calculateTotalSales: (period: Period) => number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStock: 0,
    stockValue: 0,
    totalSales: 0,
    profit: 0,
  });

  // Products
  const addProduct = (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date() }
          : product,
      ),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Sales
  const addSale = (sale: Omit<Sale, "id" | "date">) => {
    const newSale: Sale = {
      ...sale,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
    };
    setSales([...sales, newSale]);

    // Update product quantity
    const product = products.find((p) => p.id === sale.productId);
    if (product) {
      updateProduct(product.id, {
        quantity: product.quantity - sale.quantity,
      });
    }
  };

  const getSalesByPeriod = (period: Period) => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return sales.filter((sale) => sale.date >= startDate);
  };

  // Expenses
  const addExpense = (expense: Omit<Expense, "id" | "date">) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const getExpensesByPeriod = (period: Period) => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return expenses.filter((expense) => expense.date >= startDate);
  };

  const calculateStockValue = () => {
    return products.reduce((total, product) => {
      return total + product.quantity * product.buyPrice;
    }, 0);
  };

  const calculateTotalSales = (period: Period) => {
    const periodSales = getSalesByPeriod(period);
    return periodSales.reduce((total, sale) => total + sale.totalPrice, 0);
  };

  const calculateProfit = (period: Period) => {
    const periodSales = getSalesByPeriod(period);
    return periodSales.reduce((total, sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (!product) return total;
      const profit = (sale.salePrice - product.buyPrice) * sale.quantity;
      return total + profit;
    }, 0);
  };

  // Update metrics
  useEffect(() => {
    const updateMetrics = () => {
      const totalStock = products.reduce(
        (sum, product) => sum + product.quantity,
        0,
      );
      const stockValue = calculateStockValue();
      const totalSales = calculateTotalSales("month");
      const monthlyProfit = calculateProfit("month");

      setMetrics({
        totalStock,
        stockValue,
        totalSales,
        profit: monthlyProfit,
      });
    };

    updateMetrics();
  }, [products, sales]);

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    sales,
    addSale,
    getSalesByPeriod,
    expenses,
    addExpense,
    getExpensesByPeriod,
    metrics,
    calculateProfit,
    calculateStockValue,
    calculateTotalSales,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
