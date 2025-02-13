
const Shipping = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-12">Shipping Policy</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Shipping Information</h2>
              <p className="text-gray-600 mb-4">
                We want to ensure your premium chocolates and confectionery arrive in perfect condition. 
                Our shipping methods are carefully selected to maintain the quality of your order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Shipping Methods</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Standard Shipping (5-7 business days)</li>
                <li>Express Shipping (2-3 business days)</li>
                <li>Next Day Delivery (order before 2 PM)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Shipping Rates</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Standard Shipping: $5.99</li>
                <li>Express Shipping: $12.99</li>
                <li>Next Day Delivery: $24.99</li>
                <li>Free shipping on orders over $50</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Order Processing</h2>
              <p className="text-gray-600 mb-4">
                Orders are processed within 24 hours of being placed. You will receive a confirmation 
                email with tracking information once your order has been shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-playfair font-semibold mb-4">International Shipping</h2>
              <p className="text-gray-600">
                We currently ship to select international destinations. International shipping rates 
                and delivery times vary by location. Please contact our customer service team for 
                more information about international shipping options.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
