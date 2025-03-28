
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviews_count: number;
  delivery_time?: string;
};
