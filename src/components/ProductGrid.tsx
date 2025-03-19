
import { Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";

type ProductGridProps = {
  products: Product[];
  isLoading: boolean;
  searchTerm: string;
  productWishlistStatus: {[key: number]: boolean};
  onAddToCart: (product: Product) => void;
  onProductSelect: (product: Product) => void;
  onWishlistChange: () => void;
};

export function ProductGrid({
  products,
  isLoading,
  searchTerm,
  productWishlistStatus,
  onAddToCart,
  onProductSelect,
  onWishlistChange,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-16">
        {searchTerm ? "No products match your search criteria" : "No products available"}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onProductSelect={onProductSelect}
          isInWishlist={productWishlistStatus[product.id] || false}
          onWishlistChange={onWishlistChange}
        />
      ))}
    </div>
  );
}
