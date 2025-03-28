
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

type CategoryData = {
  category: string;
  subcategories: string[];
  image?: string;
}

// Define category images mapping
const categoryImages: Record<string, string> = {
  "Chocolates": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=1335&ixlib=rb-4.0.3",
  "Candies": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=1335&ixlib=rb-4.0.3",
  "Gift Box": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1340&ixlib=rb-4.0.3",
  "Truffles": "https://images.unsplash.com/photo-1548741487-18d861fea837?auto=format&fit=crop&q=80&w=1363&ixlib=rb-4.0.3",
  // Add more categories as needed
};

const Categories = () => {
  const { categories, subcategories, isLoading } = useCategories();
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  
  useEffect(() => {
    if (categories.length > 0) {
      const formattedData: CategoryData[] = categories.map(category => ({
        category,
        subcategories: subcategories[category] || [],
        image: categoryImages[category] || "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=1287&ixlib=rb-4.0.3" // Default image if not found
      }));
      
      setCategoriesData(formattedData);
    }
  }, [categories, subcategories]);

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
                {/* Main category card */}
                <Link
                  to={`/products?category=${encodeURIComponent(categoryData.category)}`}
                  className="group"
                >
                  <div className="bg-primary/10 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                    <img 
                      src={categoryData.image} 
                      alt={categoryData.category}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <h2 className="text-2xl font-playfair font-semibold text-white relative z-10 text-center px-4">
                      All {categoryData.category}
                    </h2>
                  </div>
                </Link>
                
                {/* Subcategory cards */}
                {categoryData.subcategories.map((subcategory, subIndex) => (
                  <Link
                    key={subIndex}
                    to={`/products?category=${encodeURIComponent(categoryData.category)}&subcategory=${encodeURIComponent(subcategory)}`}
                    className="group"
                  >
                    <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                      <img 
                        src={categoryData.image} 
                        alt={subcategory}
                        className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
