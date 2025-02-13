
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block mb-4 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium animate-fade-down">
            Welcome to SweetCart Haven
          </span>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 animate-fade-down" style={{ animationDelay: "0.1s" }}>
            Discover Premium Sweets & Chocolates
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-down" style={{ animationDelay: "0.2s" }}>
            Indulge in our exquisite collection of chocolates, candies, and treats from around the world.
          </p>
          <div className="space-x-4 animate-fade-down" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
              <Link to="/products">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">
            Explore Our Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className="group relative overflow-hidden rounded-lg aspect-square animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity group-hover:bg-black/50">
                  <div className="text-center">
                    <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                      {category.title}
                    </h3>
                    <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                      <Link to={category.link}>Explore</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const categories = [
  {
    title: "Premium Chocolates",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80",
    link: "/categories/chocolates"
  },
  {
    title: "Mint Candies",
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80",
    link: "/categories/candies"
  },
  {
    title: "Gift Boxes",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80",
    link: "/categories/gifts"
  }
];

export default Index;
