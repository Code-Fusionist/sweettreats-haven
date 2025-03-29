
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  delivery_time: string | null;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
};
