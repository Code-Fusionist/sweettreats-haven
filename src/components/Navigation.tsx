
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    // Initial count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-2xl font-playfair font-semibold text-primary"
          >
            SweetTreats
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-primary hover:text-accent transition-colors"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-primary hover:text-accent transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/tracking"
              className="text-primary hover:text-accent transition-colors"
            >
              Track Order
            </Link>
            <Link
              to="/cart"
              className="text-primary hover:text-accent transition-colors"
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-primary focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg animate-fade-down">
            <div className="px-4 py-2 space-y-4">
              <Link
                to="/products"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                Categories
              </Link>
              <Link
                to="/tracking"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                Track Order
              </Link>
              <Link
                to="/cart"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                Cart ({cartCount})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
