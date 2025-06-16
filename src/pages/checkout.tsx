import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCartItem, clearCart } from '../utils/cart';
import { ArrowLeft, Check, CreditCard, MapPin } from 'lucide-react';
import type { CartItem } from '../utils/cart';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingData, setShippingData] = useState({
    streetAddress: '',
    city: '',
    zipCode: ''
  });
  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);

  useEffect(() => {
    const item = getCartItem();
    if (!item) {
      navigate('/', { replace: true });
      return;
    }
    setCartItem(item);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinueToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingData.streetAddress || !shippingData.city || !shippingData.zipCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setShowAddressConfirmation(true);
    setTimeout(() => {
      setCurrentStep('payment');
    }, 1500);
  };

  const handleClearCart = () => {
    clearCart();
    navigate('/', { replace: true });
  };

  if (!cartItem) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <Link to="/" className="text-[#0046be] hover:text-[#003494]">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { product } = cartItem;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Link to={`/product/${product.slug}`} className="inline-flex items-center text-[#0046be] hover:text-[#003494] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Link>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'shipping' ? 'bg-[#0046be] text-white' : 
                  currentStep === 'payment' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'payment' ? <Check className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep === 'shipping' ? 'text-[#0046be]' : 
                  currentStep === 'payment' ? 'text-green-500' : 'text-gray-600'
                }`}>
                  Shipping Address
                </span>
              </div>
              
              <div className={`h-1 w-16 ${currentStep === 'payment' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'payment' ? 'bg-[#0046be] text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep === 'payment' ? 'text-[#0046be]' : 'text-gray-600'
                }`}>
                  Payment
                </span>
              </div>
            </div>
          </div>

          {currentStep === 'shipping' ? (
            /* Shipping Step - Two Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Section - Cart Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.condition}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-600">Quantity: {cartItem.quantity}</span>
                      <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-4">
                    <span>Total:</span>
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleClearCart}
                  className="w-full mt-6 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-300"
                >
                  Clear Cart
                </button>
              </div>

              {/* Right Section - Shipping Form */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                
                {showAddressConfirmation ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Address Confirmed!</h3>
                    <p className="text-gray-600">Proceeding to payment...</p>
                  </div>
                ) : (
                  <form onSubmit={handleContinueToCheckout} className="space-y-6">
                    <div>
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={shippingData.streetAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                        placeholder="10001"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0046be] hover:bg-[#003494] text-white font-medium py-3 rounded-lg transition-colors duration-300"
                    >
                      Continue to Checkout
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Payment Step - Full Width Layout */
            <div className="max-w-4xl mx-auto">
              {/* Shipping Address Summary - Compact */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Shipping to:</h3>
                    <p className="text-sm text-gray-600">
                      {shippingData.streetAddress}, {shippingData.city}, {shippingData.zipCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.title}</p>
                    <p className="text-lg font-bold text-[#0046be]">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Section - Full Width */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Complete Your Purchase</h2>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={product.checkoutLink}
                    className="w-full h-[700px] border-0"
                    title="Secure Checkout"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    🔒 Your payment is secured with industry-standard encryption
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;