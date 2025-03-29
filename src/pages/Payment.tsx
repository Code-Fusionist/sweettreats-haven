
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const generateTrackingNumber = () => {
    return 'TRK' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(-4).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      
      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }
      
      // Calculate total price
      const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      // Generate tracking number
      const trackingNumber = generateTrackingNumber();
      
      // Create order in the database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          tracking_number: trackingNumber,
          total: totalPrice,
          status: 'pending',
          shipping_address: paymentMethod === 'cod' ? address : 'Not provided', 
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Add order items to the database
      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart after successful order
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cartUpdated'));

      toast({
        title: "Order Placed Successfully!",
        description: `Your tracking number is: ${trackingNumber}`,
      });

      setLoading(false);
      navigate('/tracking', { state: { orderId: order.id, trackingNumber } });
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place your order",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1">Pay with Card</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1">Pay on Delivery (Cash/UPI)</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input 
                      id="address" 
                      placeholder="Enter your full address" 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Processing..." : paymentMethod === "card" ? "Pay Now" : "Place Order"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
