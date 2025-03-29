
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isInWishlist } from "@/services/wishlist";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [productWishlistStatus, setProductWishlistStatus] = useState<{[key: number]: boolean}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get filter parameters from URL
  const searchTerm = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const subcategoryFilter = searchParams.get("subcategory") || "";
  const sortBy = searchParams.get("sort") || "";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 5000);
  const deliveryTime = searchParams.get("delivery") || "";

  // Custom hooks for fetching data
  const { categories, subcategories } = useCategories();
  const { products, isLoading, fetchProducts } = useProducts(
    searchTerm,
    selectedCategory || categoryFilter,
    subcategoryFilter,
    sortBy,
    minPrice,
    maxPrice,
    deliveryTime,
    []  // Empty array since we removed subcategories filter
  );

  // Initialize category selection from URL
  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
  }, [categoryFilter]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchParams, selectedCategory]);

  // Check wishlist status when products or user change
  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [products, user]);

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
    // Navigate to product detail page is now handled in ProductCard component
  };

  const handleWishlistChange = () => {
    checkWishlistStatus();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === "all" ? "" : category);
    
    // Update URL to reflect category change
    const newParams = new URLSearchParams(searchParams);
    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    newParams.delete("subcategory");
    setSearchParams(newParams);
  };

  // Predefined category lists for the top filter
  const predefinedCategories = [
    { id: "all", name: "All Products" },
    ...categories.map(category => ({ id: category, name: category }))
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-playfair font-bold text-center mb-8">
        Our Products
      </h1>
      
      {/* Categories section */}
      <div className="flex justify-center mb-10 overflow-x-auto pb-4">
        <div className="flex space-x-2">
          {predefinedCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id || (category.id === "all" && !selectedCategory) ? "default" : "outline"}
              onClick={() => handleCategorySelect(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <ProductFilters 
            categories={[]}  // Remove categories from filters since we have them in the top buttons
            minPrice={minPrice}
            maxPrice={maxPrice}
            deliveryTime={deliveryTime}
            onApplyFilters={fetchProducts}
          />
        </div>
        
        {/* Products Grid */}
        <div className="md:col-span-3">
          <ProductGrid 
            products={products}
            isLoading={isLoading}
            searchTerm={searchTerm}
            productWishlistStatus={productWishlistStatus}
            onAddToCart={handleAddToCart}
            onProductSelect={handleProductSelect}
            onWishlistChange={handleWishlistChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
