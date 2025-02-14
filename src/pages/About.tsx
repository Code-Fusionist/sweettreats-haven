
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-12">About SweetCart Haven</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Welcome to SweetTreats Haven, your premier destination for premium chocolates and confectionery from around the world. We are passionate about bringing you the finest selection of sweets, carefully curated to satisfy your cravings and delight your senses.
            </p>
            
            <h2 className="text-2xl font-playfair font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2025, SweetTreats Haven was born from a simple love for quality chocolates and a desire to share that passion with others. What started as a small online boutique has grown into a beloved destination for chocolate enthusiasts and gift-givers alike.
            </p>
            
            <h2 className="text-2xl font-playfair font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We believe that every moment of indulgence should be special. Our mission is to provide you with the highest quality confectionery products, exceptional customer service, and a seamless shopping experience that makes treating yourself or your loved ones a true pleasure.
            </p>
            
            <h2 className="text-2xl font-playfair font-semibold mb-4">Quality Guarantee</h2>
            <p className="text-gray-600">
              Every product in our collection is carefully selected and handled with the utmost care. We work directly with renowned chocolatiers and confectionery makers to ensure that each item meets our stringent quality standards. Your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
