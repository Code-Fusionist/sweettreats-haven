
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { isInWishlist } from "@/services/wishlist";
import { useAuth } from "@/contexts/AuthContext";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productWishlistStatus, setProductWishlistStatus] = useState<{[key: number]: boolean}>({});
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [products, user]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("products").select("*");
      
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user || products.length === 0) return;
    
    const statusMap: {[key: number]: boolean} = {};
    
    for (const product of products) {
      try {
        statusMap[product.id] = await isInWishlist(product.id);
      } catch (error) {
        console.error(`Error checking wishlist status for product ${product.id}:`, error);
      }
    }
    
    setProductWishlistStatus(statusMap);
  };

  const handleAddToCart = (product: Product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id
    );
    
    if (existingItemIndex !== -1) {
      // If product exists, increase quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // If product doesn't exist, add new item
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count in Navigation
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleProductSelect = (product: Product) => {
    // For now just show a toast, in future we could navigate to product detail page
    toast({
      title: product.name,
      description: `${product.description} - ₹${product.price}`,
    });
  };

  const handleWishlistChange = () => {
    checkWishlistStatus();
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-playfair font-bold text-center mb-8">
        {searchTerm ? `Search results for "${searchTerm}"` : "Our Products"}
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          {searchTerm ? "No products match your search criteria" : "No products available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onProductSelect={handleProductSelect}
              isInWishlist={productWishlistStatus[product.id] || false}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
