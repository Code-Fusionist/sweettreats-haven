
import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { isInWishlist } from "@/services/wishlist";
import { useAuth } from "@/contexts/AuthContext";
import { SearchBar } from "@/components/SearchBar";

// Import UI components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{[key: string]: string[]}>({});
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [products, user]);

  useEffect(() => {
    // Initialize selected subcategories from URL if present
    if (subcategoryFilter) {
      setSelectedSubcategories([subcategoryFilter]);
    } else {
      setSelectedSubcategories([]);
    }
  }, [subcategoryFilter]);

  const fetchCategories = async () => {
    try {
      // Fetch unique categories
      const { data: categoryData, error: categoryError } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);
      
      if (categoryError) throw categoryError;
      
      const uniqueCategories = [...new Set(categoryData.map(item => item.category))];
      setCategories(uniqueCategories);

      // Fetch subcategories for each category
      const subcategoriesMap: {[key: string]: string[]} = {};
      
      for (const category of uniqueCategories) {
        const { data, error } = await supabase
          .from("products")
          .select("subcategory")
          .eq("category", category)
          .not("subcategory", "is", null);
        
        if (error) throw error;
        
        // Filter out any null values and extract only the subcategory string
        const validSubcategories = data
          .filter(item => item.subcategory !== null)
          .map(item => item.subcategory as string);
        
        // Remove duplicates
        subcategoriesMap[category] = [...new Set(validSubcategories)];
      }
      
      setSubcategories(subcategoriesMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("products").select("*");
      
      // Apply search filter
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }
      
      // Apply category filter
      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }
      
      // Apply subcategory filter if selected
      if (selectedSubcategories.length > 0 || subcategoryFilter) {
        const subcats = selectedSubcategories.length > 0 ? 
          selectedSubcategories : [subcategoryFilter];
        query = query.in("subcategory", subcats);
      }
      
      // Apply price range filter
      query = query.gte("price", minPrice).lte("price", maxPrice);
      
      // Apply sorting
      if (sortBy) {
        switch (sortBy) {
          case "price-asc":
            query = query.order("price", { ascending: true });
            break;
          case "price-desc":
            query = query.order("price", { ascending: false });
            break;
          case "name-asc":
            query = query.order("name", { ascending: true });
            break;
          case "name-desc":
            query = query.order("name", { ascending: false });
            break;
          default:
            // Default sorting
            query = query.order("name", { ascending: true });
        }
      } else {
        // Default sorting if none specified
        query = query.order("name", { ascending: true });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // For delivery time filter - in a real app this would be a database column
      // For demo purposes we'll simulate it in the frontend
      let filteredData = data || [];
      if (deliveryTime) {
        switch(deliveryTime) {
          case "under-24h":
            // Simulate delivery time filter - products with IDs divisible by 2 are "fast delivery"
            filteredData = filteredData.filter(product => product.id % 2 === 0);
            break;
          case "1-2-days":
            // Simulate 1-2 days delivery for products with IDs divisible by 3
            filteredData = filteredData.filter(product => product.id % 3 === 0);
            break;
          case "3-5-days":
            // Simulate 3-5 days delivery for other products
            filteredData = filteredData.filter(product => product.id % 3 !== 0 && product.id % 2 !== 0);
            break;
        }
      }
      
      setProducts(filteredData as Product[]);
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
          <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="categories">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="space-y-1">
                        <div className="font-medium">{category}</div>
                        {subcategories[category]?.map((subcategory) => (
                          <div key={subcategory} className="flex items-center space-x-2 ml-4">
                            <Checkbox 
                              id={`subcategory-${subcategory}`} 
                              checked={selectedSubcategories.includes(subcategory)}
                              onCheckedChange={() => handleSubcategoryChange(subcategory)}
                            />
                            <label 
                              htmlFor={`subcategory-${subcategory}`}
                              className="text-sm cursor-pointer"
                            >
                              {subcategory}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Min: ₹{minPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Max: ₹{maxPrice}</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="delivery">
                <AccordionTrigger>Delivery Time</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="delivery-24h" checked={deliveryTime === "under-24h"} />
                      <label htmlFor="delivery-24h" className="text-sm">Under 24 hours</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="delivery-1-2" checked={deliveryTime === "1-2-days"} />
                      <label htmlFor="delivery-1-2" className="text-sm">1-2 days</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="delivery-3-5" checked={deliveryTime === "3-5-days"} />
                      <label htmlFor="delivery-3-5" className="text-sm">3-5 days</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Separator className="my-4" />
            
            <Button className="w-full" onClick={fetchProducts}>
              Apply Filters
            </Button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              {searchTerm ? "No products match your search criteria" : "No products available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default Products;
