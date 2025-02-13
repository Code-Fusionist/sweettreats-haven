
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { products } from "./Products";

const Categories = () => {
  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-playfair font-bold text-center mb-12">Categories</h1>
        
        <div className="grid gap-8">
          {categories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 p-6 md:p-8">
                  <div>
                    <h2 className="text-2xl font-playfair font-semibold mb-4">{category.title}</h2>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getProductsByCategory(category.slug).map(product => (
                        <Link 
                          key={product.id} 
                          to={`/products`}
                          state={{ productId: product.id }}
                          className="flex items-center space-x-2 text-gray-700 hover:text-accent"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const categories = [
  {
    title: "Chocolates",
    slug: "chocolates",
    description: "Discover our premium selection of milk, dark, and nutty chocolates from renowned brands worldwide.",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80"
  },
  {
    title: "Mint Candies",
    slug: "candies",
    description: "Refresh your senses with our collection of mint candies, from classic breath fresheners to sugar-free options.",
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80"
  },
  {
    title: "Gift Boxes",
    slug: "gifts",
    description: "Perfect for any occasion, our curated gift boxes feature premium chocolates and treats.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80"
  }
];

export default Categories;
