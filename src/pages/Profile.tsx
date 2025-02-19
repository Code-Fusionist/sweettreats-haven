
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Package, Star, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    address: "",
  });

  const [orders] = useState([
    {
      id: "ORD123456",
      date: "2024-03-20",
      total: 599,
      status: "Delivered",
      items: [
        { name: "Dairy Milk Silk", quantity: 2, price: 299 },
      ]
    },
  ]);

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const removeFromWishlist = (productId: number) => {
    const newWishlist = wishlist.filter((item: any) => item.id !== productId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-8">My Account</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your past orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>
                  Products you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((item: any) => (
                    <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-semibold">₹{item.price}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromWishlist(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>My Reviews</CardTitle>
                <CardDescription>
                  Reviews you've written for products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  No reviews yet
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
