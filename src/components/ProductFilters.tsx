
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ProductFiltersProps = {
  categories: string[];
  subcategories: {[key: string]: string[]};
  selectedSubcategories: string[];
  minPrice: number;
  maxPrice: number;
  deliveryTime: string;
  onSubcategoryChange: (subcategory: string) => void;
  onApplyFilters: () => void;
};

export function ProductFilters({
  categories,
  subcategories,
  selectedSubcategories,
  minPrice,
  maxPrice,
  deliveryTime,
  onSubcategoryChange,
  onApplyFilters,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([minPrice || 0, maxPrice || 5000]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>(deliveryTime);
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleDeliveryTimeChange = (value: string) => {
    setSelectedDeliveryTime(value === selectedDeliveryTime ? "" : value);
  };

  return (
    <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <Accordion type="multiple" className="w-full" defaultValue={["subcategories", "price", "delivery"]}>
        <AccordionItem value="subcategories">
          <AccordionTrigger>Subcategories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {Object.entries(subcategories).map(([category, categorySubcategories]) => (
                <div key={category} className="space-y-1">
                  {categorySubcategories.map((subcategory) => (
                    <div key={subcategory} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`subcategory-${subcategory}`} 
                        checked={selectedSubcategories.includes(subcategory)}
                        onCheckedChange={() => onSubcategoryChange(subcategory)}
                      />
                      <label 
                        htmlFor={`subcategory-${subcategory}`}
                        className="text-sm cursor-pointer"
                      >
                        {subcategory}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
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
      
      <Button className="w-full" onClick={onApplyFilters}>
        <Filter className="mr-2 h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}
