
import { useState, useEffect } from "react";
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFiltersProps = {
  minPrice: number;
  maxPrice: number;
  deliveryTime: string;
  sortBy: string;
  onApplyFilters: () => void;
};

export function ProductFilters({
  minPrice,
  maxPrice,
  deliveryTime,
  sortBy,
  onApplyFilters,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([minPrice || 0, maxPrice || 5000]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>(deliveryTime);
  const [selectedSort, setSelectedSort] = useState<string>(sortBy);
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    // Update state when props change
    setPriceRange([minPrice || 0, maxPrice || 5000]);
    setSelectedDeliveryTime(deliveryTime);
    setSelectedSort(sortBy);
  }, [minPrice, maxPrice, deliveryTime, sortBy]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleDeliveryTimeChange = (value: string) => {
    setSelectedDeliveryTime(value);
  };
  
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  const applyFilters = () => {
    // Create new search params based on current ones
    const newParams = new URLSearchParams(searchParams);
    
    // Update price range parameters
    newParams.set("minPrice", priceRange[0].toString());
    newParams.set("maxPrice", priceRange[1].toString());
    
    // Update delivery time parameter
    if (selectedDeliveryTime) {
      newParams.set("delivery", selectedDeliveryTime);
    } else {
      newParams.delete("delivery");
    }
    
    // Update sort parameter
    if (selectedSort) {
      newParams.set("sort", selectedSort);
    } else {
      newParams.delete("sort");
    }
    
    // Update URL with new parameters
    setSearchParams(newParams);
    
    // Call the provided callback to fetch products with new filters
    onApplyFilters();
  };

  return (
    <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <Accordion type="multiple" className="w-full" defaultValue={["price", "delivery", "sort"]}>
        <AccordionItem value="price">
          <AccordionTrigger className="flex items-center">
            <span className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Price Range
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider 
                defaultValue={[minPrice || 0, maxPrice || 5000]} 
                min={0} 
                max={5000} 
                step={100}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Min: ₹{priceRange[0]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 text-right">Max: ₹{priceRange[1]}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="delivery">
          <AccordionTrigger>Delivery Time</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select value={selectedDeliveryTime} onValueChange={handleDeliveryTimeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select delivery time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="under-24h">Under 24 hours</SelectItem>
                  <SelectItem value="1-2-days">1-2 days</SelectItem>
                  <SelectItem value="3-5-days">3-5 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="sort">
          <AccordionTrigger>Sort By</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select value={selectedSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Featured</SelectItem>
                  <SelectItem value="price-asc">
                    <div className="flex items-center">
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Price: Low to High
                    </div>
                  </SelectItem>
                  <SelectItem value="price-desc">
                    <div className="flex items-center">
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Price: High to Low
                    </div>
                  </SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="rating-desc">
                    <div className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Highest Rating
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
      
      <Button className="w-full" onClick={applyFilters}>
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
