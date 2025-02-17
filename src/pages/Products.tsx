
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const products = [
  {
    id: 1,
    name: "Dairy Milk Silk",
    description: "Smooth milk chocolate with rich cocoa",
    details: "Experience the silky smooth texture of premium milk chocolate. Made with the finest cocoa beans and fresh milk, this chocolate bar melts in your mouth for a heavenly experience.",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1623660053975-e8f0f1845cce?auto=format&fit=crop&q=80",
    category: "chocolates"
  },
  {
    id: 2,
    name: "Lindt Excellence",
    description: "Premium dark chocolate with 70% cocoa",
    details: "Savor the intense flavor of 70% dark chocolate. Crafted by Swiss chocolatiers, this bar offers a perfect balance of bitterness and sweetness.",
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
  },
  {
    id: 11,
    name: "Mint Fresh Pack",
    description: "Refreshing mint candies for fresh breath",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    category: "candies",
    details: "A pack of refreshing mint candies perfect for any time of day. Sugar-free and long-lasting flavor."
  },
  {
    id: 12,
    name: "Dark Truffle Box",
    description: "Luxury dark chocolate truffles",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80",
    category: "truffles",
    details: "Handcrafted dark chocolate truffles with a smooth ganache center. Perfect for gifting or self-indulgence."
  },
  {
    id: 13,
    name: "Raspberry Chocolates",
    description: "Dark chocolate with raspberry filling",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&q=80",
    category: "chocolates",
    details: "Premium dark chocolate shells filled with real raspberry puree. A perfect balance of sweet and tart."
  }
  {
    id: 14,
    name: "Life Savers Mints",
    description: "Classic ring-shaped refreshing mint candy.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    category: "candies",
    details: "A pack of refreshing, sugar-free mints with a long-lasting flavor, perfect for any time of day."
  },
];

const Products = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check for product ID from category page
    const state = location.state as { productId?: number };
    if (state?.productId) {
      const product = products.find(p => p.id === state.productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [location]);

  const addToCart = (product: typeof products[0]) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    
    // Dispatch event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
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
              <div 
                className="aspect-square overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
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

        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          {selectedProduct && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  <div className="mt-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-600 mb-4">{selectedProduct.details || selectedProduct.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold">${selectedProduct.price}</span>
                      <Button onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
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

export default Products;
