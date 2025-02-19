
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { products } from "@/pages/Products";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Only show first 5 results

  const handleSelect = (productId: number) => {
    setShowResults(false);
    setSearchQuery("");
    navigate("/products", { state: { productId } });
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowResults(searchQuery.length > 0)}
            className="w-full pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            if (searchQuery) {
              navigate("/products");
            }
          }}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showResults && searchQuery && (
        <div 
          className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border py-2 z-50"
          onMouseLeave={() => setShowResults(false)}
        >
          {filteredProducts.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No results found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => handleSelect(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-8 w-8 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{product.price} - {product.category}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
