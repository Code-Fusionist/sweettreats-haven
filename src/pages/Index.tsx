
import { useState, useEffect, useRef } from "react";
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
  
  // Refs for parallax effect
  const heroRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedProducts();
    
    // Parallax scroll effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Parallax for hero section
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
      
      // Fade in effects for other sections
      if (productsRef.current) {
        const productsSectionTop = productsRef.current.offsetTop;
        const productsSectionHeight = productsRef.current.offsetHeight;
        if (scrollPosition > productsSectionTop - window.innerHeight / 1.5) {
          productsRef.current.style.opacity = "1";
          productsRef.current.style.transform = "translateY(0)";
        }
      }
      
      if (reviewsRef.current) {
        const reviewsSectionTop = reviewsRef.current.offsetTop;
        if (scrollPosition > reviewsSectionTop - window.innerHeight / 1.3) {
          reviewsRef.current.style.opacity = "1";
          reviewsRef.current.style.transform = "translateY(0)";
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
        .limit(8);
      
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
      {/* Hero Section with Parallax Effect */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center bg-fixed bg-cover bg-center transition-all duration-300"
        style={{ 
          backgroundImage: "url('https://img.freepik.com/free-photo/top-view-glazed-doughnuts-with-assortment-candy-marshmallow_23-2148423364.jpg?semt=ais_hybrid')"
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 animate-fade-in">
            Welcome to SweetTreats Haven
          </h1>
          <h2 className="text-2xl md:text-4xl font-playfair font-medium mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Discover Premium Sweets & Treats
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Indulge in our signature collection of handcrafted sweets and delicacies,
            perfect for every occasion or a sweet little treat for yourself.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button size="lg" asChild>
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section with Scroll Animation */}
      <section 
        ref={productsRef}
        className="py-16 bg-gray-50 opacity-0 transform translate-y-10 transition-all duration-700"
      >
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

      {/* Customer Reviews Section with Scroll Animation */}
      <section 
        ref={reviewsRef}
        className="py-16 opacity-0 transform translate-y-10 transition-all duration-700"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
    name: "Bhavya Munjal",
    rating: 5,
    comment: "The assorted chocolate box was perfect for my anniversary celebration. Everyone loved the variety and quality of flavors! I love chocolate and as a chocolate lover I recommend this website they serve premium varietys."
  },
  {
    name: "Keshav Aggarwal",
    rating: 4.5,
    comment: "I ordered the gift box for my mother's birthday. The packaging was beautiful and the sweets were delicious. Will order again."
  },
  {
    name: "Mohit Sharma",
    rating: 5,
    comment: "The handcrafted chocolates are truly exceptional. You can taste the quality and care put into making them. Highly recommend!"
  },
  {
    "name": "Hardik Solanki",
    "rating": 5,
    "comment": "Amazing chocolates! The taste and texture are just perfect. Will definitely order again!"
  },
  {
    "name": "Bhaskar Kataria",
    "rating": 4,
    "comment": "The packaging and flavors were fantastic. Just a little improvement needed in delivery speed."
  },
  {
    "name": "Pranav Kumar",
    "rating": 5,
    "comment": "Loved the rich taste and variety of chocolates. A perfect gift option for any occasion!"
  },
  {
    "name": "Kartikeya Kishtwal",
    "rating": 4,
    "comment": "The chocolates were delicious, but I wish there were more sugar-free options. Otherwise, amazing quality!"
  }
];

export default Index;
