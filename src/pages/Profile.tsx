
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Package, Heart, LogOut, Edit, Save, X } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserOrders();
      fetchWishlist();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setFormData({
        first_name: data?.first_name || "",
        last_name: data?.last_name || "",
        phone: data?.phone || "",
        address: data?.address || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("*, products(*)")
        .eq("user_id", user?.id);
      
      if (error) throw error;
      
      setWishlist(data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      setIsEditing(false);
      fetchUserProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      fetchWishlist();
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist."
      });
    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove from wishlist",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card className="bg-white shadow-md h-full">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-white text-2xl">
                    {profile?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl flex flex-col gap-1">
                  {isEditing ? (
                    <>
                      <Input 
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="mb-2"
                      />
                      <Input 
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="mb-2"
                      />
                    </>
                  ) : (
                    <span>
                      {profile?.first_name || ''} {profile?.last_name || ''}
                    </span>
                  )}
                  <span className="text-sm font-normal text-gray-500">{user?.email}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Phone</label>
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1 block">Address</label>
                      <Input 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                      <p>{profile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p>{profile?.address || 'Not provided'}</p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleProfileUpdate}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Orders and Wishlist Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="w-full mb-4 grid grid-cols-2">
                <TabsTrigger value="orders" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription>
                      View and track all your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>You haven't placed any orders yet.</p>
                        <Button variant="outline" className="mt-4" asChild>
                          <a href="/products">Start Shopping</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="font-medium">Order #{order.id.substring(0, 8)}</h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium">Total: ₹{order.total}</span>
                                <p className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                                  {order.status}
                                </p>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              {order.order_items && order.order_items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                                    {item.products?.image && (
                                      <img 
                                        src={item.products.image} 
                                        alt={item.products.name}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.products?.name}</p>
                                    <p className="text-xs text-gray-500">
                                      ₹{item.price} × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 text-right">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/tracking?order=${order.id}`}>Track Order</a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Wishlist</CardTitle>
                    <CardDescription>
                      Items you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Heart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>Your wishlist is empty.</p>
                        <Button variant="outline" className="mt-4" asChild>
                          <a href="/products">Browse Products</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 flex">
                            <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden">
                              {item.products?.image && (
                                <img 
                                  src={item.products.image} 
                                  alt={item.products.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <h3 className="font-medium">{item.products?.name}</h3>
                              <p className="text-sm text-primary font-medium">₹{item.products?.price}</p>
                              <div className="mt-2 flex gap-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={`/product/${item.product_id}`}>View</a>
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => removeFromWishlist(item.id)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
