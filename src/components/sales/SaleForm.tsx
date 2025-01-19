import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/contexts/InventoryContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const saleSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.string().min(1, "Quantidade é obrigatória"),
  salePrice: z.string().min(1, "Preço de venda é obrigatório"),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleFormProps {
  onClose?: () => void;
  productId?: string;
}

export default function SaleForm({ onClose, productId }: SaleFormProps) {
  const { products, addSale } = useInventory();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      productId: productId || "",
      quantity: "1",
      salePrice: "",
    },
  });

  const selectedProductId = watch("productId");
  const quantity = parseInt(watch("quantity") || "0");
  const salePrice = parseFloat(watch("salePrice") || "0");
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const calculateTotal = () => {
    return quantity * salePrice;
  };

  const calculateProfit = () => {
    if (!selectedProduct) return 0;
    return (salePrice - selectedProduct.buyPrice) * quantity;
  };

  const onSubmit = (data: SaleFormData) => {
    if (!selectedProduct) return;

    const quantity = parseInt(data.quantity);
    const salePrice = parseFloat(data.salePrice);
    const totalPrice = quantity * salePrice;

    addSale({
      productId: data.productId,
      quantity,
      salePrice,
      totalPrice,
    });

    onClose?.();
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Registrar Venda</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productId">Produto</Label>
          <Select defaultValue={productId} {...register("productId")}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.productId && (
            <p className="text-sm text-red-500">{errors.productId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={selectedProduct?.quantity || 1}
            {...register("quantity")}
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salePrice">Preço de Venda Unitário (R$)</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            placeholder="0,00"
            {...register("salePrice")}
            className={errors.salePrice ? "border-red-500" : ""}
          />
          {errors.salePrice && (
            <p className="text-sm text-red-500">{errors.salePrice.message}</p>
          )}
        </div>

        {selectedProduct && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <p className="text-sm text-gray-600">
              Estoque disponível: {selectedProduct.quantity}
            </p>
            <p className="text-sm text-gray-600">
              Preço de custo: R$ {selectedProduct.buyPrice.toFixed(2)}
            </p>
            <p className="text-lg font-semibold">
              Total da venda: R$ {calculateTotal().toFixed(2)}
            </p>
            <p className="text-sm text-green-600">
              Lucro previsto: R$ {calculateProfit().toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Confirmar Venda</Button>
        </div>
      </form>
    </Card>
  );
}
