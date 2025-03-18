
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const products = [
  {
    id: 1,
    name: "Dairy Milk Silk",
    description: "Smooth milk chocolate with rich cocoa",
    details: "Experience the silky smooth texture of premium milk chocolate. Made with the finest cocoa beans and fresh milk, this chocolate bar melts in your mouth for a heavenly experience.",
    price: 199,
    image: "https://db8hgexwnviud.cloudfront.net/images/detailed/2831/61UAkasfAPL.jpg?t=1697633388",
    category: "chocolates"
  },
  {
    id: 2,
    name: "Lindt Excellence",
    description: "Premium dark chocolate with 70% cocoa",
    details: "Savor the intense flavor of 70% dark chocolate. Crafted by Swiss chocolatiers, this bar offers a perfect balance of bitterness and sweetness.",
    price: 799,
    image: "https://m.media-amazon.com/images/I/41ZzWoi-KfL._SX300_SY300_QL70_FMwebp_.jpg",
    category: "chocolates"
  },
  {
    id: 3,
    name: "Premium Gift Box",
    description: "Assorted chocolates in an elegant box",
    price: 2999,
    image: "https://www.chokola.in/pub/media/catalog/product/cache/8913e99aadde0a1b971244e9cae421cf/s/w/sweet_memories_of_india_1_.jpg",
    category: "gifts"
  },
  {
    id: 4,
    name: "Truffle Collection",
    description: "Handcrafted chocolate truffles",
    price: 1599,
    image: "https://atmospherestudio.in/cdn/shop/files/0D3A5747_1000x.jpg?v=1728281925",
    category: "truffles"
  },
  {
    id: 5,
    name: "Polo Mints",
    description: "Classic breath freshening mints",
    price: 309,
    image: "https://m.media-amazon.com/images/I/716J75wkqTL._SX522_.jpg",
    category: "candies"
  },
  {
    id: 6,
    name: "Mentos Fresh",
    description: "Chewy mint candies",
    price: 179,
    image: "https://www.bigbasket.com/media/uploads/p/l/40107653-2_6-mentos-pure-fresh-sugarfree-mint-flavour-chewing-gum.jpg",
    category: "candies"
  },
  {
    id: 7,
    name: "Ferrero Rocher Moments",
    description: "Luxury chocolate gift box",
    price: 249,
    image: "https://m.media-amazon.com/images/I/61Gyg-yEcoL._SY450_PIbundle-16,TopRight,0,0_AA450SH20_.jpg",
    category: "gifts"
  },
  {
    id: 8,
    name: "Jus’Trufs Classic Chocolate Truffles",
    description: "Rich dark chocolate truffles",
    price: 699,
    image: "https://m.media-amazon.com/images/I/91hOl6fxHEL._SX679_PIbundle-9,TopRight,0,0_SX679SY489SH20_.jpg",
    category: "truffles"
  },
  {
    id: 9,
    name: "Ghirardelli Squares",
    description: "Premium milk chocolate squares",
    price: 2499,
    image: "https://m.media-amazon.com/images/I/71PyqnEU8+L._SX522_.jpg",
    category: "chocolates"
  },
  {
    id: 10,
    name: "Assorted Dates Celebration Box",
    description: "Premium Middle Eastern chocolate treat", 
    price: 799,
    image: "https://natuf.in/cdn/shop/files/DatesChococoated18pcs.png?v=1739389301&width=700",
    category: "gifts"
  },
  {
    id: 11,
    name: "Mint Fresh Pack",
    description: "Refreshing mint candies for fresh breath",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    category: "candies",
    details: "A pack of refreshing mint candies perfect for any time of day. Sugar-free and long-lasting flavor."
  },
  {
    id: 12,
    name: "Dark Truffle Box",
    description: "Luxury dark chocolate truffles",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80",
    category: "truffles",
    details: "Handcrafted dark chocolate truffles with a smooth ganache center. Perfect for gifting or self-indulgence."
  },
  {
    id: 13,
    name: "Raspberry Chocolates",
    description: "Dark chocolate with raspberry filling",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&q=80",
    category: "chocolates",
    details: "Premium dark chocolate shells filled with real raspberry puree. A perfect balance of sweet and tart."
  },
  {
    "id": 14,
    "name": "Life Savers Mints",
    "description": "Refreshing sugar-free mints with a long-lasting flavor",
    "price": 4.99,
    "image": "https://images-cdn.ubuy.co.in/651ef2ea3da1af110d0f032c-life-savers-pep-o-mint-breath-mints-hard.jpg",
    "category": "candies",
    "details": "Classic ring-shaped mints that provide a refreshing burst of coolness. Perfect for freshening breath anytime, anywhere."
},
{
    "id": 15,
    "name": "KitKat Chunky",
    "description": "Crispy wafer covered in milk chocolate",
    "price": 2.49,
    "image": "https://m.media-amazon.com/images/I/31BwdBH74WL._SX300_SY300_QL70_FMwebp_.jpg",
    "category": "chocolates",
    "details": "Enjoy the satisfying crunch of KitKat Chunky. A delicious crispy wafer covered in smooth milk chocolate."
},
{
    "id": 16,
    "name": "Toblerone",
    "description": "Swiss milk chocolate with honey and almond nougat",
    "price": 5.49,
    "image": "https://m.media-amazon.com/images/I/61OQfk4rnQL._SX522_.jpg",
    "category": "chocolates",
    "details": "Iconic Swiss chocolate with a unique triangular shape, made with honey and almond nougat for a delicious treat."
},
{
    "id": 17,
    "name": "Godiva Gold Collection",
    "description": "Premium assorted chocolate gift box",
    "price": 39.99,
    "image": "https://images-cdn.ubuy.co.in/633abfd5f43a8f731b7d9630-godivas-belgium-goldmark-assorted.jpg",
    "category": "gifts",
    "details": "An exquisite collection of handcrafted chocolates, including dark, milk, and white chocolate varieties."
},
{
    "id": 18,
    "name": "Baci Perugina",
    "description": "Dark chocolate with hazelnut filling",
    "price": 14.99,
    "image": "https://images-cdn.ubuy.co.in/6615ee8a458b5132fb1aa791-perugina-baci-classic-dark-chocolate.jpg",
    "category": "truffles",
    "details": "A smooth dark chocolate shell with a luscious hazelnut filling, topped with a whole hazelnut."
},
{
    "id": 19,
    "name": "Altoids Peppermint",
    "description": "Intensely strong peppermint mints",
    "price": 3.49,
    "image": "https://m.media-amazon.com/images/I/61piVNTqSOL._SX522_.jpg",
    "category": "candies",
    "details": "A classic tin of intensely strong peppermint mints, perfect for freshening breath on the go."
},
{
    "id": 20,
    "name": "Ferrero Rocher Gift Pack",
    "description": "Assorted luxury chocolates",
    "price": 27.99,
    "image": "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/b9e1bb59-3832-49a6-b46c-077c388b1e34.jpg?ts=1738649982",
    "category": "gifts",
    "details": "A premium selection of Ferrero chocolates, including Ferrero Rocher, Raffaello, and Rondnoir."
},
{
    "id": 21,
    "name": "Snickers Bar",
    "description": "Chocolate bar with nougat, caramel, and peanuts",
    "price": 1.99,
    "image": "https://m.media-amazon.com/images/I/51LRrilIFSL._SX522_.jpg",
    "category": "chocolates",
    "details": "A delicious combination of nougat, caramel, and roasted peanuts covered in smooth milk chocolate."
},
{
    "id": 22,
    "name": "Hershey's Milk Chocolate",
    "description": "Classic creamy milk chocolate bar",
    "price": 3.49,
    "image": "https://m.media-amazon.com/images/I/51VWvwPHUJL._SX522_.jpg",
    "category": "chocolates",
    "details": "Smooth and creamy milk chocolate bar from Hershey's, a perfect treat for any occasion."
},
{
    "id": 23,
    "name": "Cadbury Celebrations Box",
    "description": "Assorted Cadbury chocolates gift box",
    "price": 12.99,
    "image": "https://www.sendgiftsahmedabad.com/pub/media/catalog/product/cache/fe2a752764b2352ecdbaaa90a203554f/c/h/chocolate_gift_pack_with_cadbury_celebrations_box.jpg",
    "category": "gifts",
    "details": "A delightful mix of classic Cadbury chocolates, perfect for sharing and gifting."
},
{
    "id": 24,
    "name": "Lindt Lindor Truffles",
    "description": "Irresistibly smooth chocolate truffles",
    "price": 18.99,
    "image": "https://www.chocolate.lindt.com/media/catalog/product/l/i/lindt_lindor_milk_chocolate_truffles_box_2.png?quality=80&fit=bounds&height=700&width=700&canvas=700:700",
    "category": "truffles",
    "details": "Delicious chocolate truffles with a smooth, melting center, available in various flavors."
},
 {
    "id": 25,
    "name": "Tic Tac Fresh Mint",
    "description": "Refreshing mint candies",
    "price": 2.49,
    "image": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    "category": "candies",
    "details": "Tiny, flavorful mint candies in a handy pocket-sized pack for long-lasting freshness."
  },
  {
    "id": 26,
    "name": "Raffaello Almond Coconut Treats",
    "description": "White chocolate with coconut and almond",
    "price": 10.99,
    "image": "https://images.unsplash.com/photo-1551529834-525807d6b4f3?auto=format&fit=crop&q=80",
    "category": "truffles",
    "details": "A blend of white chocolate, coconut, and almonds, creating an indulgent and exotic treat."
  },
  {
    "id": 27,
    "name": "Nestlé Quality Street",
    "description": "Assorted chocolates and toffees",
    "price": 15.99,
    "image": "https://images.unsplash.com/photo-1548741487-18d363dc4469?auto=format&fit=crop&q=80",
    "category": "gifts",
    "details": "A mix of individually wrapped chocolates and toffees, perfect for gifting and sharing."
  },
  {
    "id": 28,
    "name": "Mars Bar",
    "description": "Chocolate bar with nougat and caramel",
    "price": 2.99,
    "image": "https://images.unsplash.com/photo-1571987503171-7e03830a2f15?auto=format&fit=crop&q=80",
    "category": "chocolates",
    "details": "Soft nougat and caramel coated in milk chocolate, offering a delicious and satisfying taste."
  },
  {
    "id": 29,
    "name": "Haribo Goldbears",
    "description": "Classic gummy bear candy",
    "price": 3.99,
    "image": "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    "category": "candies",
    "details": "Fruity and chewy gummy bears in a variety of flavors, loved by all ages."
  },
  {
    "id": 30,
    "name": "Dove Dark Chocolate",
    "description": "Smooth and rich dark chocolate squares",
    "price": 5.99,
    "image": "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&q=80",
    "category": "chocolates",
    "details": "Indulgent dark chocolate squares made with premium cocoa for a velvety taste experience."
  }  
];

const Products = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check for product ID from category page
    const state = location.state as { productId?: number };
    if (state?.productId) {
      const product = products.find(p => p.id === state.productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [location]);

  const addToCart = (product: typeof products[0]) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    
    // Dispatch event to update cart count in navigation
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-center mb-8">Our Products</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div 
                className="aspect-square overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-playfair font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">₹{product.price}</span>
                  <Button onClick={() => addToCart(product)}>Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          {selectedProduct && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  <div className="mt-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-600 mb-4">{selectedProduct.details || selectedProduct.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold">₹{selectedProduct.price}</span>
                      <Button onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

const categories = [
  { label: "All Products", value: "all" },
  { label: "Chocolates", value: "chocolates" },
  { label: "Candies", value: "candies" },
  { label: "Gift Boxes", value: "gifts" },
  { label: "Truffles", value: "truffles" }
];

export default Products;
