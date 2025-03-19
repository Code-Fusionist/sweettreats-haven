
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
  return (
    <div className="sticky top-24 bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="space-y-1">
                  <div className="font-medium">{category}</div>
                  {subcategories[category]?.map((subcategory) => (
                    <div key={subcategory} className="flex items-center space-x-2 ml-4">
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
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Min: ₹{minPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max: ₹{maxPrice}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="delivery">
          <AccordionTrigger>Delivery Time</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="delivery-24h" checked={deliveryTime === "under-24h"} />
                <label htmlFor="delivery-24h" className="text-sm">Under 24 hours</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="delivery-1-2" checked={deliveryTime === "1-2-days"} />
                <label htmlFor="delivery-1-2" className="text-sm">1-2 days</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="delivery-3-5" checked={deliveryTime === "3-5-days"} />
                <label htmlFor="delivery-3-5" className="text-sm">3-5 days</label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
      
      <Button className="w-full" onClick={onApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
