
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
  deliveryTime: string
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
      
      // Apply delivery time filter if present
      if (deliveryTime) {
        query = query.eq("delivery_time", deliveryTime);
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
          case "rating-desc":
            query = query.order("rating", { ascending: false });
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
      
      // Transform the data to ensure all fields have values
      const processedData = (data || []).map(item => ({
        ...item,
        subcategory: item.subcategory || '', // Add subcategory field if it doesn't exist
        rating: item.rating || 0,
        reviews_count: item.reviews_count || 0,
        delivery_time: item.delivery_time || '3-5-days'
      })) as Product[];
      
      setProducts(processedData);
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
  }, [searchTerm, categoryFilter, subcategoryFilter, sortBy, minPrice, maxPrice, deliveryTime]);

  return { products, isLoading, fetchProducts };
}
