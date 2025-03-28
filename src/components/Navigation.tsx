import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { AuthNav } from "./AuthNav";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories();

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

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      // Show login dialog instead of navigating to profile
      const authNavButton = document.querySelector('[data-testid="auth-nav-button"]');
      if (authNavButton && authNavButton instanceof HTMLElement) {
        authNavButton.click();
      }
    }
  };

  // Split categories into columns for better display
  const splitCategories = () => {
    const midpoint = Math.ceil(categories.length / 2);
    return {
      left: categories.slice(0, midpoint),
      right: categories.slice(midpoint)
    };
  };

  const { left, right } = splitCategories();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-playfair font-semibold text-primary"
          >
            SweetCart
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            <div className="flex-grow max-w-md">
              <SearchBar />
            </div>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-1 lg:w-[700px]">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/products"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">All Products</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse our full collection of premium sweets and treats
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((category) => (
                          <NavigationMenuLink key={category} asChild>
                            <Link
                              to={`/products?category=${encodeURIComponent(category)}`}
                              className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {category}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link
              to="/categories"
              className="text-primary hover:text-accent transition-colors"
            >
              Categories
            </Link>
            
            <Link
              to="/tracking"
              className="text-primary hover:text-accent transition-colors whitespace-nowrap"
              onClick={handleProfileClick}
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
              className="text-primary hover:text-accent transition-colors whitespace-nowrap"
              onClick={handleProfileClick}
            >
              Profile
            </Link>
            
            <AuthNav />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-primary focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg animate-fade-down">
            <div className="px-4 py-2 space-y-4">
              <div className="py-2">
                <SearchBar />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between flex items-center">
                    Products <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[60vh] overflow-auto">
                  <DropdownMenuItem>
                    <Link to="/products" className="w-full" onClick={toggleMenu}>
                      All Products
                    </Link>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category}>
                      <Link 
                        to={`/products?category=${encodeURIComponent(category)}`} 
                        className="w-full"
                        onClick={toggleMenu}
                      >
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
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
                onClick={(e) => {
                  toggleMenu();
                  if (!user) handleProfileClick(e);
                }}
              >
                Track Order
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center text-primary hover:text-accent transition-colors py-2"
                onClick={toggleMenu}
              >
                <span className="mr-2">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link
                to="/profile"
                className="block text-primary hover:text-accent transition-colors py-2"
                onClick={(e) => {
                  toggleMenu();
                  if (!user) handleProfileClick(e);
                }}
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
