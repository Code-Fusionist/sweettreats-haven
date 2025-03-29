
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }
    
    setCart(cartItems);
    
    // Calculate total
    const cartTotal = cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    setTotal(cartTotal);
  }, [navigate]);
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    
    setExpiryDate(value);
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };
  
  const processPayment = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your purchase",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          status: 'processing',
          shipping_address: localStorage.getItem('shipping_address') || null
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Save order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Simulate payment processing
      setTimeout(() => {
        // Clear cart
        localStorage.setItem("cart", "[]");
        
        // Update order status
        supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderData.id)
          .then(() => {
            setPaymentComplete(true);
            setProcessingPayment(false);
            
            // Dispatch cart updated event
            window.dispatchEvent(new Event("cartUpdated"));
            
            // After 2 seconds, navigate to thank you page
            setTimeout(() => {
              navigate(`/tracking?order=${orderData.id}`);
            }, 2000);
          });
      }, 2000);
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment",
        variant: "destructive",
      });
      setProcessingPayment(false);
    }
  };
  
  const validateForm = () => {
    if (paymentMethod === "card") {
      return (
        cardNumber.replace(/\s/g, "").length === 16 &&
        cardName.length > 3 &&
        expiryDate.length === 5 &&
        cvv.length === 3
      );
    }
    return true;
  };
  
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-playfair font-bold text-center mb-8">Payment</h1>
      
      {paymentComplete ? (
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 text-green-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Payment Successful</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase! Redirecting you to your order...
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4 mb-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label
                  htmlFor="card"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label
                  htmlFor="cash"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Cash on Delivery</span>
                </Label>
              </div>
            </RadioGroup>
            
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      maxLength={3}
                      type="password"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === "cash" && (
              <div className="p-4 bg-gray-100 rounded-lg mt-4">
                <p className="text-sm text-gray-700">
                  You will pay for your items when they are delivered to your address.
                  Please have the exact amount ready for the delivery person.
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              className="w-full mt-6"
              onClick={processPayment}
              disabled={processingPayment || !validateForm()}
            >
              {processingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                `Pay ${paymentMethod === "card" ? "Now" : "on Delivery"}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
