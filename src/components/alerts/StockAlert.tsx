import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface StockAlertProps {
  productName?: string;
  currentStock?: number;
  threshold?: number;
}

const StockAlert = ({
  productName = "Produto Exemplo",
  currentStock = 5,
  threshold = 10,
}: StockAlertProps) => {
  return (
    <Alert variant="destructive" className="bg-white border-red-500">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Alerta de Estoque Baixo</AlertTitle>
      <AlertDescription>
        {productName} está com estoque baixo. Quantidade atual: {currentStock}{" "}
        (abaixo do limite de {threshold})
      </AlertDescription>
    </Alert>
  );
};

export default StockAlert;
