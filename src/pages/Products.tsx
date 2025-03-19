
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isInWishlist } from "@/services/wishlist";

const Products = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productWishlistStatus, setProductWishlistStatus] = useState<Record<number, boolean>>({});
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Check for product ID from category page
    const state = location.state as { productId?: number };
    if (state?.productId) {
      const product = products.find(p => p.id === state.productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [location, products]);

  useEffect(() => {
    if (user && products.length > 0) {
      checkWishlistStatus();
    }
  }, [user, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      
      if (data) {
        setProducts(data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const statuses: Record<number, boolean> = {};
      
      // This is inefficient for many products, but works for our demo
      for (const product of products) {
        statuses[product.id] = await isInWishlist(product.id);
      }
      
      setProductWishlistStatus(statuses);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const addToCart = (product: any) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    
    // Dispatch event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-center mb-8">Our Products</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onProductSelect={setSelectedProduct}
              isInWishlist={productWishlistStatus[product.id]}
              onWishlistChange={checkWishlistStatus}
            />
          ))}
        </div>

        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          {selectedProduct && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  <div className="mt-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-600 mb-4">{selectedProduct.details || selectedProduct.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold">₹{selectedProduct.price}</span>
                      <Button onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

const categories = [
  { label: "All Products", value: "all" },
  { label: "Chocolates", value: "chocolates" },
  { label: "Candies", value: "candies" },
  { label: "Gift Boxes", value: "gifts" },
  { label: "Truffles", value: "truffles" }
];

export default Products;
