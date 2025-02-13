
const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-playfair font-bold text-center mb-12">Returns & Refunds</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Return Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not entirely 
                happy with your order, we're here to help.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Return Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Items must be unused and in original packaging</li>
                <li>Returns must be initiated within 14 days of delivery</li>
                <li>Seasonal and custom items are final sale</li>
                <li>Perishable items cannot be returned</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">How to Return</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-600">
                <li>Contact our customer service team</li>
                <li>Receive a return authorization number</li>
                <li>Package your return securely</li>
                <li>Ship to the provided return address</li>
                <li>Refund will be processed within 5-7 business days of receipt</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-playfair font-semibold mb-4">Refund Options</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Original payment method refund</li>
                <li>Store credit (additional 10% bonus)</li>
                <li>Exchange for another item</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-playfair font-semibold mb-4">Damaged Items</h2>
              <p className="text-gray-600">
                If you receive a damaged item, please contact us immediately with photos of the 
                damage. We will arrange for a replacement or refund at no additional cost to you.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
