
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{[key: string]: string[]}>({});

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, subcategories, fetchCategories };
}
