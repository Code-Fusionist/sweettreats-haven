
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, Check, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";

const Tracking = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get("order") || "";
  
  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [isTracking, setIsTracking] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialOrderId) {
      handleTrack(null, initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = async (e?: React.FormEvent, orderId?: string) => {
    if (e) e.preventDefault();
    
    const trackOrderId = orderId || orderNumber;
    
    if (!trackOrderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch order details from the database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", trackOrderId)
        .single();
      
      if (orderError) throw orderError;
      
      if (!orderData) {
        throw new Error("Order not found");
      }
      
      setOrderDetails(orderData);
      setIsTracking(true);
      
      toast({
        title: "Order Found",
        description: "Showing tracking information for order " + trackOrderId,
      });
    } catch (error: any) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to find order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate tracking steps based on order status
  const getTrackingSteps = () => {
    if (!orderDetails) return [];
    
    const status = orderDetails.status;
    const createdAt = new Date(orderDetails.created_at);
    
    // Base steps
    const steps = [
      {
        title: "Order Confirmed",
        description: "Your order has been confirmed and is being processed",
        date: createdAt.toLocaleDateString() + " - " + createdAt.toLocaleTimeString(),
        icon: Check,
        completed: true
      }
    ];
    
    // Add shipping step if status is at least 'processing'
    if (status === 'processing' || status === 'shipped' || status === 'delivered') {
      const shippingDate = new Date(createdAt);
      shippingDate.setDate(shippingDate.getDate() + 1);
      
      steps.push({
        title: "Order Processing",
        description: "Your order is being prepared for shipment",
        date: shippingDate.toLocaleDateString() + " - " + shippingDate.toLocaleTimeString(),
        icon: Package,
        completed: true
      });
    }
    
    // Add in transit step if status is at least 'shipped'
    if (status === 'shipped' || status === 'delivered') {
      const transitDate = new Date(createdAt);
      transitDate.setDate(transitDate.getDate() + 2);
      
      steps.push({
        title: "Order Shipped",
        description: "Your order has been shipped via express delivery",
        date: transitDate.toLocaleDateString() + " - " + transitDate.toLocaleTimeString(),
        icon: Truck,
        completed: true
      });
    }
    
    // Add delivered step if status is 'delivered'
    if (status === 'delivered') {
      const deliveryDate = new Date(createdAt);
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      
      steps.push({
        title: "Order Delivered",
        description: "Your order has been delivered to your address",
        date: deliveryDate.toLocaleDateString() + " - " + deliveryDate.toLocaleTimeString(),
        icon: Check,
        completed: true
      });
    } else {
      // Add waiting for delivery step if not delivered yet
      const expectedDate = new Date(createdAt);
      expectedDate.setDate(expectedDate.getDate() + 3);
      
      steps.push({
        title: "Delivery Expected",
        description: "Your order is expected to be delivered soon",
        date: expectedDate.toLocaleDateString() + " - " + expectedDate.toLocaleTimeString(),
        icon: Clock,
        completed: false
      });
    }
    
    return steps;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">Track Your Order</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={(e) => handleTrack(e)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Track Order"}
            </Button>
          </form>
        </div>

        {isTracking && orderDetails && (
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-up">
            <div className="space-y-8">
              <h2 className="font-playfair font-semibold text-xl mb-6">Order Status</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Order Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-medium">{orderDetails.id.substring(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(orderDetails.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium capitalize">{orderDetails.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-medium">₹{orderDetails.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                {getTrackingSteps().map((step, index) => (
                  <div key={step.title} className="relative flex items-center mb-8">
                    <div className="absolute left-8 -translate-x-1/2">
                      <div className={`w-4 h-4 rounded-full ${step.completed ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center`}>
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

export default Tracking;
