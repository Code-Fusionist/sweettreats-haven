
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{[key: string]: string[]}>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // Fetch unique categories
      const { data: categoryData, error: categoryError } = await supabase
        .from("products")
        .select("category")
        .not("category", "is", null);
      
      if (categoryError) throw categoryError;
      
      const uniqueCategories = [...new Set(categoryData
        .map(item => item.category)
        .filter(Boolean))] as string[];
      
      setCategories(uniqueCategories);

      // For this demo, we'll create simulated subcategories for each category
      const subcategoriesMap: {[key: string]: string[]} = {};
      
      // Create simulated subcategories for each category
      subcategoriesMap["Chocolates"] = ["Dark Chocolate", "Milk Chocolate", "White Chocolate", "Truffle Chocolate"];
      subcategoriesMap["Candies"] = ["Hard Candy", "Gummy Candy", "Cotton Candy", "Lollipops"];
      subcategoriesMap["Gift Box"] = ["Assorted Box", "Holiday Special", "Premium Box", "Custom Box"];
      subcategoriesMap["Truffles"] = ["Chocolate Truffle", "Cocoa Dusted", "Fruit Filled", "Liqueur Truffle"];
      
      setSubcategories(subcategoriesMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, subcategories, fetchCategories, isLoading };
}
