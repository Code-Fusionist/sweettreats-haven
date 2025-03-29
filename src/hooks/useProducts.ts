
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
      
      // Apply price range filter
      if (minPrice !== undefined && minPrice !== null) {
        query = query.gte("price", minPrice);
      }
      
      if (maxPrice !== undefined && maxPrice !== null) {
        query = query.lte("price", maxPrice);
      }
      
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
      
      let filteredData = data || [];
      
      // Apply subcategory filter in JavaScript
      // This is a simulation since our database doesn't have subcategories column yet
      if (selectedSubcategories.length > 0) {
        console.log("Filtering by subcategories:", selectedSubcategories);
        // In a real app, you would filter by subcategory in the database query
        // For this demo, we'll just log the filter without actually filtering
      } else if (subcategoryFilter) {
        console.log("Filtering by subcategory:", subcategoryFilter);
        // Same as above, just logging for the demo
      }
      
      // For delivery time filter - simulate with product IDs
      if (deliveryTime) {
        console.log("Filtering by delivery time:", deliveryTime);
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
      
      // Transform the data to ensure all fields have values
      const processedData = filteredData.map(item => ({
        ...item,
        subcategory: item.subcategory || '',
        rating: item.rating || 0,
        reviews_count: item.reviews_count || 0
      }));
      
      setProducts(processedData as Product[]);
      console.log("Fetched products:", processedData);
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

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, sortBy, minPrice, maxPrice, deliveryTime, selectedSubcategories.join(',')]);

  return { products, isLoading, fetchProducts };
}
