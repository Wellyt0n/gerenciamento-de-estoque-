export interface Product {
  id: string;
  name: string;
  category: string;
  buyPrice: number;
  quantity: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  salePrice: number;
  date: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
}

export type Period = "day" | "week" | "month" | "year";

export interface DashboardMetrics {
  totalStock: number;
  stockValue: number;
  totalSales: number;
  profit: number;
}
