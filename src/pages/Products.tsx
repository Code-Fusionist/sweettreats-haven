
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isInWishlist } from "@/services/wishlist";
import { SearchBar } from "@/components/SearchBar";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [productWishlistStatus, setProductWishlistStatus] = useState<{[key: number]: boolean}>({});
  const [searchParams] = useSearchParams();
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
    categoryFilter,
    subcategoryFilter,
    sortBy,
    minPrice,
    maxPrice,
    deliveryTime,
    selectedSubcategories
  );

  // Initialize selected subcategories from URL if present
  useEffect(() => {
    if (subcategoryFilter) {
      setSelectedSubcategories([subcategoryFilter]);
    } else {
      setSelectedSubcategories([]);
    }
  }, [subcategoryFilter]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Check wishlist status when products or user change
  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [products, user]);

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategory)) {
        return prev.filter(sc => sc !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
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
        {categoryFilter ? `${categoryFilter} Products` : 
         searchTerm ? `Search results for "${searchTerm}"` : 
         "All Products"}
      </h1>
      
      <div className="flex justify-center mb-8">
        <SearchBar />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <ProductFilters 
            categories={categories}
            subcategories={subcategories}
            selectedSubcategories={selectedSubcategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            deliveryTime={deliveryTime}
            onSubcategoryChange={handleSubcategoryChange}
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
