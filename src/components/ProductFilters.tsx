
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
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

type ProductFiltersProps = {
  minPrice: number;
  maxPrice: number;
  deliveryTime: string;
  onApplyFilters: () => void;
};

export function ProductFilters({
  minPrice,
  maxPrice,
  deliveryTime,
  onApplyFilters,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([minPrice || 0, maxPrice || 5000]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>(deliveryTime);
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    // Update price range when props change
    setPriceRange([minPrice || 0, maxPrice || 5000]);
    setSelectedDeliveryTime(deliveryTime);
  }, [minPrice, maxPrice, deliveryTime]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleDeliveryTimeChange = (value: string) => {
    setSelectedDeliveryTime(value === selectedDeliveryTime ? "" : value);
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
    
    // Update URL with new parameters
    setSearchParams(newParams);
    
    // Call the provided callback to fetch products with new filters
    onApplyFilters();
  };

  return (
    <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <Accordion type="multiple" className="w-full" defaultValue={["price", "delivery"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
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
              <Button
                variant={selectedDeliveryTime === "under-24h" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleDeliveryTimeChange("under-24h")}
              >
                Under 24 hours
              </Button>
              <Button
                variant={selectedDeliveryTime === "1-2-days" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleDeliveryTimeChange("1-2-days")}
              >
                1-2 days
              </Button>
              <Button
                variant={selectedDeliveryTime === "3-5-days" ? "default" : "outline"}
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleDeliveryTimeChange("3-5-days")}
              >
                3-5 days
              </Button>
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
