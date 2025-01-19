import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/contexts/InventoryContext";
import { Textarea } from "@/components/ui/textarea";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  buyPrice: z.string().min(1, "Preço de compra é obrigatório"),
  quantity: z.string().min(1, "Quantidade é obrigatória"),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onClose?: () => void;
  productId?: string;
}

const defaultFormValues: ProductFormData = {
  name: "",
  category: "",
  buyPrice: "",
  quantity: "",
  description: "",
};

export default function ProductForm({ onClose, productId }: ProductFormProps) {
  const { addProduct, updateProduct, products } = useInventory();
  const isEditing = Boolean(productId);
  const currentProduct = productId
    ? products.find((p) => p.id === productId)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: currentProduct
      ? {
          name: currentProduct.name,
          category: currentProduct.category,
          buyPrice: currentProduct.buyPrice.toString(),
          quantity: currentProduct.quantity.toString(),
          description: currentProduct.description,
        }
      : defaultFormValues,
  });

  const onSubmit = (data: ProductFormData) => {
    const productData = {
      name: data.name,
      category: data.category,
      buyPrice: parseFloat(data.buyPrice),
      quantity: parseInt(data.quantity),
      description: data.description,
    };

    if (isEditing && productId) {
      updateProduct(productId, productData);
    } else {
      addProduct(productData);
    }

    onClose?.();
  };

  return (
    <Card className="w-full max-w-2xl p-6 bg-white shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Editar Produto" : "Novo Produto"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            placeholder="Digite o nome do produto"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            placeholder="Digite a categoria do produto"
            {...register("category")}
            className={errors.category ? "border-red-500" : ""}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyPrice">Preço de Compra (R$)</Label>
          <Input
            id="buyPrice"
            type="number"
            placeholder="0,00"
            step="0.01"
            {...register("buyPrice")}
            className={errors.buyPrice ? "border-red-500" : ""}
          />
          {errors.buyPrice && (
            <p className="text-sm text-red-500">{errors.buyPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade em Estoque</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            {...register("quantity")}
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">{errors.quantity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Digite a descrição do produto"
            {...register("description")}
            className="h-32"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? "Atualizar Produto" : "Adicionar Produto"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
