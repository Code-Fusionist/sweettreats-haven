
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

export function useProducts(
  searchTerm: string,
  categoryFilter: string,
  subcategoryFilter: string,
  sortBy: string,
  minPrice: number,
  maxPrice: number,
  deliveryTime: string,
  selectedSubcategories: string[]
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  return { products, isLoading, fetchProducts };
}
