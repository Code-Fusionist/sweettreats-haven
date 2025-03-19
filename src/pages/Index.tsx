
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { isInWishlist } from "@/services/wishlist";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

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
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-5xl font-playfair font-bold mb-6">
            Discover Premium Sweets & Treats
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Indulge in our signature collection of handcrafted sweets and delicacies,
            perfect for every occasion or a sweet little treat for yourself.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-playfair font-bold">Featured Products</h2>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link to="/products">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

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

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/products?category=Sweet" className="group">
              <div className="bg-amber-100 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <h3 className="text-2xl font-playfair font-semibold text-white relative z-10">Sweets</h3>
              </div>
            </Link>
            <Link to="/products?category=Savory" className="group">
              <div className="bg-green-100 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <h3 className="text-2xl font-playfair font-semibold text-white relative z-10">Savory</h3>
              </div>
            </Link>
            <Link to="/products?category=Gift Box" className="group">
              <div className="bg-purple-100 rounded-lg overflow-hidden h-64 flex items-center justify-center relative hover:shadow-lg transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <h3 className="text-2xl font-playfair font-semibold text-white relative z-10">Gift Boxes</h3>
              </div>
            </Link>
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link to="/categories">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 10% off your first purchase plus updates on new arrivals and special offers.
          </p>
          {/* Newsletter form would go here */}
        </div>
      </section>
    </div>
  );
};

export default Index;
