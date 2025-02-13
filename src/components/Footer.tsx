
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              SweetCart Haven brings you premium chocolates and confectionery from around the world. Experience luxury in every bite.
            </p>
          </div>
          
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@sweetchart.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Sweet Street,</li>
              <li>Chocolate City, CC 12345</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-playfair text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-300">
          <p>&copy; 2024 SweetCart Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
