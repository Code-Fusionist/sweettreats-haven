
import { supabase } from "@/integrations/supabase/client";

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
};

export const getWishlist = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      product:products(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }

  return data as WishlistItem[];
};

export const addToWishlist = async (productId: number) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("wishlists")
    .insert([{ 
      product_id: productId,
      user_id: session.session.user.id
    }])
    .select();

  if (error) {
    if (error.code === "23505") {
      // Unique violation - item already in wishlist
      return { message: "Item already in wishlist" };
    }
    console.error("Error adding to wishlist:", error);
    throw error;
  }

  return data;
};

export const removeFromWishlist = async (productId: number) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", session.session.user.id);

  if (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }

  return { success: true };
};

export const isInWishlist = async (productId: number) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) {
    return false;
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", session.session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }

  return !!data;
};
