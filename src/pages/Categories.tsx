
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";

type CategoryData = {
  category: string;
  subcategories: string[];
  image?: string;
}

const Categories = () => {
  const { categories, subcategories, isLoading } = useCategories();
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [categoryImages, setCategoryImages] = useState<{[key: string]: string}>({});
  
  // Fetch category images from products table
  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("category, image")
          .not("image", "is", null);
        
        if (error) throw error;
        
        // Get one image per category
        const images: {[key: string]: string} = {};
        data.forEach(item => {
          if (item.category && item.image && !images[item.category]) {
            images[item.category] = item.image;
          }
        });
        
        setCategoryImages(images);
      } catch (error) {
        console.error("Error fetching category images:", error);
      }
    };
    
    fetchCategoryImages();
  }, []);
  
  useEffect(() => {
    if (categories.length > 0) {
      const formattedData: CategoryData[] = categories.map(category => ({
        category,
        subcategories: subcategories[category] || [],
        image: categoryImages[category] || ""
      }));
      
      setCategoriesData(formattedData);
    }
  }, [categories, subcategories, categoryImages]);

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-playfair font-bold text-center mb-12">Shop by Category</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categoriesData.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          No categories available
        </div>
      ) : (
        <div className="space-y-16">
          {categoriesData.map((categoryData, index) => (
            <div key={index} className="space-y-8">
              <h2 className="text-3xl font-playfair font-semibold">
                {categoryData.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Main category card with image */}
                <Link
                  to={`/products?category=${encodeURIComponent(categoryData.category)}`}
                  className="group"
                >
                  <div className="bg-primary/10 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                    {categoryData.image ? (
                      <img 
                        src={categoryData.image} 
                        alt={categoryData.category}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                    <h2 className="text-2xl font-playfair font-semibold text-white relative z-10 text-center px-4">
                      All {categoryData.category}
                    </h2>
                  </div>
                </Link>
                
                {/* Subcategory cards */}
                {categoryData.subcategories.map((subcategory, subIndex) => (
                  <Link
                    key={subIndex}
                    to={`/products?category=${encodeURIComponent(categoryData.category)}`}
                    className="group"
                  >
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <h3 className="text-2xl font-playfair font-semibold text-white relative z-10 text-center px-4">
                        {subcategory}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
