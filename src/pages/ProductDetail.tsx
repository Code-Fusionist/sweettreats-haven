
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/services/wishlist";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (id) {
      fetchProduct();
      if (user) {
        checkWishlistStatus();
      }
    }
  }, [id, user]);
  
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const checkWishlistStatus = async () => {
    if (!user || !id) return;
    try {
      // Convert string id to number for wishlist check
      const status = await isInWishlist(parseInt(id));
      setInWishlist(status);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };
  
  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your wishlist",
      });
      return;
    }
    
    if (!product) return;
    
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        await addToWishlist(product.id);
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
      
      setInWishlist(!inWishlist);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id
    );
    
    if (existingItemIndex !== -1) {
      // If product exists, update quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add new item
      existingCart.push({
        ...product,
        quantity,
      });
    }
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Dispatch custom event to update cart count in Navigation
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) has been added to your cart`,
    });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <Button variant="ghost" className="mb-8" asChild>
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-playfair font-bold">{product.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              className={inWishlist ? "text-red-500" : "text-gray-500"}
              onClick={handleWishlistToggle}
            >
              <Heart className={inWishlist ? "fill-current" : ""} />
            </Button>
          </div>
          
          <div className="mt-2 flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= (product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.reviews_count || 0} reviews
            </span>
          </div>
          
          <div className="mt-4">
            <span className="text-2xl font-bold">₹{product.price}</span>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            </div>
          </div>
          
          {product.delivery_time && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Delivery Time</h2>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {product.delivery_time === "under-24h" ? "Under 24 Hours" : 
                 product.delivery_time === "1-2-days" ? "1-2 Days" : 
                 product.delivery_time === "3-5-days" ? "3-5 Days" : 
                 product.delivery_time}
              </span>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="mx-4 w-8 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={increaseQuantity}>
                +
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
