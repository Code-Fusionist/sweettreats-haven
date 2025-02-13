import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Products = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const addToCart = (product: typeof products[0]) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-center mb-8">Our Products</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-playfair font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">${product.price}</span>
                  <Button onClick={() => addToCart(product)}>Add to Cart</Button>
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
  { label: "All Products", value: "all" },
  { label: "Chocolates", value: "chocolates" },
  { label: "Candies", value: "candies" },
  { label: "Gift Boxes", value: "gifts" },
  { label: "Truffles", value: "truffles" }
];

const products = [
  {
    id: 1,
    name: "Dairy Milk Silk",
    description: "Smooth milk chocolate with rich cocoa",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1623660053975-e8f0f1845cce?auto=format&fit=crop&q=80",
    category: "chocolates"
  },
  {
    id: 2,
    name: "Lindt Excellence",
    description: "Premium dark chocolate with 70% cocoa",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&q=80",
    category: "chocolates"
  },
  {
    id: 3,
    name: "Premium Gift Box",
    description: "Assorted chocolates in an elegant box",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1548741487-18d363dc4469?auto=format&fit=crop&q=80",
    category: "gifts"
  },
  {
    id: 4,
    name: "Truffle Collection",
    description: "Handcrafted chocolate truffles",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80",
    category: "truffles"
  },
  {
    id: 5,
    name: "Polo Mints",
    description: "Classic breath freshening mints",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    category: "candies"
  },
  {
    id: 6,
    name: "Mentos Fresh",
    description: "Chewy mint candies",
    price: 1.99,
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    category: "candies"
  },
  {
    id: 7,
    name: "Ferrero Rocher Box",
    description: "Luxury chocolate gift box",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80",
    category: "gifts"
  },
  {
    id: 8,
    name: "Dark Chocolate Truffles",
    description: "Rich dark chocolate truffles",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80",
    category: "truffles"
  },
  {
    id: 9,
    name: "Ghirardelli Squares",
    description: "Premium chocolate squares",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&q=80",
    category: "chocolates"
  },
  {
    id: 10,
    name: "Celebration Box",
    description: "Mixed chocolate selection box",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1548741487-18d363dc4469?auto=format&fit=crop&q=80",
    category: "gifts"
  }
];

export default Products;
