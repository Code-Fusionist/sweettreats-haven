
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addToWishlist, removeFromWishlist } from "@/services/wishlist";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    subcategory?: string;
  };
  onAddToCart: (product: any) => void;
  onProductSelect: (product: any) => void;
  isInWishlist?: boolean;
  onWishlistChange?: () => void;
};

export function ProductCard({ 
  product, 
  onAddToCart,
  onProductSelect,
  isInWishlist = false,
  onWishlistChange
}: ProductCardProps) {
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your wishlist",
      });
      return;
    }
    
    setIsWishlistLoading(true);
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
      if (onWishlistChange) {
        onWishlistChange();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm ${
            inWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
          }`}
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
        >
          <Heart className={inWishlist ? "fill-current" : ""} />
        </Button>
        
        {product.subcategory && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {product.subcategory}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair font-semibold text-lg">{product.name}</h3>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">₹{product.price}</span>
          <Button onClick={handleAddToCartClick}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
