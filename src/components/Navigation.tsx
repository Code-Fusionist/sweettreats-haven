import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "./SearchBar";
import { AuthNav } from "./AuthNav";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

    updateCartCount();

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
            SweetCart
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <SearchBar />
            <Link
              to="/products"
              className="text-primary hover:text-accent transition-colors"
            >
              Products
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
            <Link
              to="/profile"
              className="text-primary hover:text-accent transition-colors"
            >
              Profile
            </Link>
            <AuthNav />
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-primary focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg animate-fade-down">
            <div className="px-4 py-2 space-y-4">
              <div className="py-2">
                <SearchBar />
              </div>
              <Link
                to="/products"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                Products
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
              <Link
                to="/profile"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <div className="py-2">
                <AuthNav />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
