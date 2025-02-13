
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Dark Chocolate Truffles",
      price: 12.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Milk Chocolate Box",
      price: 24.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80"
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-12">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full">Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
