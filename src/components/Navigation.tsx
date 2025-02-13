
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCartClick = () => {
    toast({
      title: "Cart opened",
      description: "Your shopping cart has been opened.",
    });
  };

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
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCartClick}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCartClick}
                className="w-full justify-start"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
