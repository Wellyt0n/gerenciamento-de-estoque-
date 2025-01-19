import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, MoreVertical, ArrowUpDown } from "lucide-react";
import { useInventory } from "@/contexts/InventoryContext";
import ProductForm from "../products/ProductForm";
import SaleForm from "../sales/SaleForm";
import { Product } from "@/types";

const ProductsTable = () => {
  const { products, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Produto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <ProductForm
              onClose={() => setIsProductFormOpen(false)}
              productId={selectedProduct}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer"
              >
                Nome <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                onClick={() => handleSort("category")}
                className="cursor-pointer"
              >
                Categoria <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                onClick={() => handleSort("buyPrice")}
                className="cursor-pointer"
              >
                Preço de Custo <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead
                onClick={() => handleSort("quantity")}
                className="cursor-pointer"
              >
                Estoque <ArrowUpDown className="inline h-4 w-4" />
              </TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>R$ {product.buyPrice.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setIsProductFormOpen(true);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setIsSaleFormOpen(true);
                        }}
                      >
                        Vender
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600"
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isSaleFormOpen} onOpenChange={setIsSaleFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <SaleForm
            onClose={() => setIsSaleFormOpen(false)}
            productId={selectedProduct}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTable;
