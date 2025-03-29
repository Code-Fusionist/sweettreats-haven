
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

type CategoryData = {
  category: string;
  subcategories: string[];
  image?: string;
}

// Category background images
const categoryImages: Record<string, string> = {
  "Chocolates": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
  "Candies": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
  "Gift Box": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1040&q=80",
  "Truffles": "https://images.unsplash.com/photo-1548741487-48e8a3fd35b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1034&q=80",
  // Default image for any other category
  "default": "https://images.unsplash.com/photo-1535359056830-d4badde79747?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80"
};

const Categories = () => {
  const { categories, subcategories, isLoading } = useCategories();
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  
  useEffect(() => {
    if (categories.length > 0) {
      const formattedData: CategoryData[] = categories.map(category => ({
        category,
        subcategories: subcategories[category] || [],
        image: categoryImages[category] || categoryImages.default
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
                  <div 
                    className="rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow"
                    style={{ 
                      backgroundImage: `url(${categoryData.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                    <div 
                      className="rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow bg-gray-100"
                      style={{ 
                        backgroundImage: `url(${categoryData.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.9)'
                      }}
                    >
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
