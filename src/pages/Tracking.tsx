
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, Check } from "lucide-react";

const Tracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number",
        variant: "destructive",
      });
      return;
    }
    setIsTracking(true);
    // Simulate tracking info fetch
    toast({
      title: "Order Found",
      description: "Showing tracking information for order " + orderNumber,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">Track Your Order</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <Input
                id="orderNumber"
                type="text"
                placeholder="Enter your order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Track Order
            </Button>
          </form>
        </div>

        {isTracking && (
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-up">
            <div className="space-y-8">
              <h2 className="font-playfair font-semibold text-xl mb-6">Order Status</h2>
              
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                {steps.map((step, index) => (
                  <div key={step.title} className="relative flex items-center mb-8">
                    <div className="absolute left-8 -translate-x-1/2">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <step.icon className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="ml-12">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      <span className="text-xs text-gray-500 mt-1">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const steps = [
  {
    title: "Order Confirmed",
    description: "Your order has been confirmed and is being processed",
    date: "March 20, 2024 - 10:30 AM",
    icon: Check
  },
  {
    title: "Order Shipped",
    description: "Your order has been shipped via express delivery",
    date: "March 21, 2024 - 2:15 PM",
    icon: Package
  },
  {
    title: "In Transit",
    description: "Your order is on its way to the delivery address",
    date: "March 22, 2024 - 9:45 AM",
    icon: Truck
  }
];

export default Tracking;
