
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { isInWishlist } from "@/services/wishlist";
import { Product } from "@/types/product";
import { StarIcon } from "lucide-react";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productWishlistStatus, setProductWishlistStatus] = useState<{[key: number]: boolean}>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (user && featuredProducts.length > 0) {
      checkWishlistStatus();
    }
  }, [featuredProducts, user]);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(4);
      
      if (error) throw error;
      
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user || featuredProducts.length === 0) return;
    
    const statusMap: {[key: number]: boolean} = {};
    
    for (const product of featuredProducts) {
      try {
        statusMap[product.id] = await isInWishlist(product.id);
      } catch (error) {
        console.error(`Error checking wishlist status for product ${product.id}:`, error);
      }
    }
    
    setProductWishlistStatus(statusMap);
  };

  const handleAddToCart = (product: Product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id
    );
    
    if (existingItemIndex !== -1) {
      // If product exists, increase quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // If product doesn't exist, add new item
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count in Navigation
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleProductSelect = (product: Product) => {
    // For now just show a toast, in future we could navigate to product detail page
    toast({
      title: product.name,
      description: `${product.description} - ₹${product.price}`,
    });
  };

  const handleWishlistChange = () => {
    checkWishlistStatus();
  };

  return (
    <div>
      {/* Hero Section with Full-screen Background */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/3d-cartoon-background-children_23-2150150788.jpg?semt=ais_hybrid')" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            Welcome to SweetTreats Haven
          </h1>
          <h2 className="text-2xl md:text-4xl font-playfair font-medium mb-6">
            Discover Premium Sweets & Treats
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Indulge in our signature collection of handcrafted sweets and delicacies,
            perfect for every occasion or a sweet little treat for yourself.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">Featured Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onProductSelect={handleProductSelect}
                  isInWishlist={productWishlistStatus[product.id] || false}
                  onWishlistChange={handleWishlistChange}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                No featured products available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section (Replacing Shop by Category) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="italic mb-4">{review.comment}</p>
                <div className="font-semibold">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Sample reviews data (in a real app, this would come from the database)
const reviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "The assorted chocolate box was perfect for my anniversary celebration. Everyone loved the variety and quality of flavors!"
  },
  {
    name: "Michael Chen",
    rating: 4,
    comment: "I ordered the gift box for my mother's birthday. The packaging was beautiful and the sweets were delicious. Will order again."
  },
  {
    name: "Priya Sharma",
    rating: 5,
    comment: "The handcrafted chocolates are truly exceptional. You can taste the quality and care put into making them. Highly recommend!"
  }
];

export default Index;
