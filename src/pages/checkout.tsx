import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCartItem, clearCart } from '../utils/cart';
import { ArrowLeft, Check, CreditCard, MapPin, ChevronDown } from 'lucide-react';
import type { CartItem } from '../utils/cart';

interface AddressSuggestion {
  place_id: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingData, setShippingData] = useState({
    streetAddress: '',
    city: '',
    zipCode: '',
    state: ''
  });
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);

  useEffect(() => {
    const item = getCartItem();
    if (!item) {
      navigate('/', { replace: true });
      return;
    }
    setCartItem(item);
  }, [navigate]);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsLoadingAddresses(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=us,ca&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setAddressSuggestions(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddressSuggestions([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    const { address } = suggestion;
    setShippingData({
      streetAddress: `${address.house_number || ''} ${address.road || ''}`.trim(),
      city: address.city || '',
      zipCode: address.postcode || '',
      state: address.state || ''
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));

    if (name === 'streetAddress') {
      fetchAddressSuggestions(value);
      setShowSuggestions(value.length >= 3);
    }
  };

  const handleContinueToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingData.streetAddress || !shippingData.city || !shippingData.zipCode || !shippingData.state) {
      alert('Please fill in all shipping address fields');
      return;
    }

    setShowAddressConfirmation(true);
    setTimeout(() => {
      setCurrentStep('payment');
      setShowAddressConfirmation(false);
    }, 2000);
  };

  const handleClearCart = () => {
    clearCart();
    navigate('/', { replace: true });
  };

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  const canadianProvinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon'
  ];

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
          <Link to={`/product/${product.slug}`} className="inline-flex items-center text-[#0046be] hover:text-[#003494] mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Link>

          {/* Enhanced Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center max-w-md mx-auto">
              {/* Step 1 - Shipping */}
              <div className="flex flex-col items-center">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStep === 'shipping' 
                    ? 'bg-[#0046be] text-white shadow-lg scale-110' 
                    : currentStep === 'payment' 
                    ? 'bg-[#ffef02] text-[#0046be] shadow-md' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep === 'payment' ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <MapPin className="h-6 w-6" />
                  )}
                  {currentStep === 'shipping' && (
                    <div className="absolute inset-0 rounded-full bg-[#0046be] animate-ping opacity-25"></div>
                  )}
                </div>
                <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                  currentStep === 'shipping' 
                    ? 'text-[#0046be]' 
                    : currentStep === 'payment' 
                    ? 'text-green-600' 
                    : 'text-gray-600'
                }`}>
                  Shipping Address
                </span>
              </div>
              
              {/* Progress Line */}
              <div className="flex-1 mx-6 relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ease-out ${
                    currentStep === 'payment' 
                      ? 'w-full bg-gradient-to-r from-[#ffef02] to-[#0046be]' 
                      : 'w-0 bg-[#0046be]'
                  }`}></div>
                </div>
                {currentStep === 'payment' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-white rounded-full border-2 border-[#0046be] animate-pulse"></div>
                  </div>
                )}
              </div>
              
              {/* Step 2 - Payment */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  currentStep === 'payment' 
                    ? 'bg-[#0046be] text-white shadow-lg scale-110' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  <CreditCard className="h-6 w-6" />
                  {currentStep === 'payment' && (
                    <div className="absolute inset-0 rounded-full bg-[#0046be] animate-ping opacity-25"></div>
                  )}
                </div>
                <span className={`mt-3 text-sm font-medium transition-colors duration-300 ${
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
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
                
                <div className="flex items-start space-x-6 p-6 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl border border-blue-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-24 h-24 object-cover rounded-xl shadow-sm"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg">{product.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 bg-white px-3 py-1 rounded-full inline-block">{product.condition}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Quantity: {cartItem.quantity}</span>
                      <span className="text-2xl font-bold text-[#0046be]">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-2xl font-bold border-t border-gray-200 pt-6">
                    <span>Total:</span>
                    <span className="text-[#0046be]">${product.price.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleClearCart}
                  className="w-full mt-8 px-6 py-3 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {/* Right Section - Shipping Form */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Address</h2>
                
                {showAddressConfirmation ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#ffef02] to-[#0046be] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Address Confirmed!</h3>
                    <p className="text-gray-600">Proceeding to secure payment...</p>
                    <div className="mt-4">
                      <div className="animate-pulse flex space-x-1 justify-center">
                        <div className="w-2 h-2 bg-[#0046be] rounded-full"></div>
                        <div className="w-2 h-2 bg-[#0046be] rounded-full animation-delay-200"></div>
                        <div className="w-2 h-2 bg-[#0046be] rounded-full animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContinueToCheckout} className="space-y-6">
                    {/* Street Address with Autocomplete */}
                    <div className="relative">
                      <label htmlFor="streetAddress" className="block text-sm font-semibold text-gray-700 mb-3">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={shippingData.streetAddress}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                        placeholder="123 Main Street"
                        autoComplete="street-address"
                      />
                      
                      {/* Address Suggestions */}
                      {showSuggestions && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {isLoadingAddresses ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0046be] mx-auto"></div>
                              <span className="mt-2 block">Loading addresses...</span>
                            </div>
                          ) : addressSuggestions.length > 0 ? (
                            addressSuggestions.map((suggestion) => (
                              <button
                                key={suggestion.place_id}
                                type="button"
                                onClick={() => handleAddressSelect(suggestion)}
                                className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                              >
                                <div className="font-medium text-gray-900">{suggestion.display_name}</div>
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">No addresses found</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* City and State Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-3">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                          placeholder="New York"
                          autoComplete="address-level2"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-3">
                          State/Province *
                        </label>
                        <div className="relative">
                          <select
                            id="state"
                            name="state"
                            value={shippingData.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300 appearance-none bg-white"
                          >
                            <option value="">Select State/Province</option>
                            <optgroup label="United States">
                              {usStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Canada">
                              {canadianProvinces.map(province => (
                                <option key={province} value={province}>{province}</option>
                              ))}
                            </optgroup>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-3">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-[#0046be] transition-all duration-300"
                        placeholder="10001"
                        autoComplete="postal-code"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#0046be] to-[#003494] hover:from-[#003494] hover:to-[#002a6b] text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Continue to Payment
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Payment Step - Streamlined Layout */
            <div className="max-w-4xl mx-auto">
              {/* Compact Shipping Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#ffef02] to-[#0046be] rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Shipping to:</h3>
                      <p className="text-gray-600">
                        {shippingData.streetAddress}, {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#0046be]">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Free shipping included</p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
                  <p className="text-gray-600">Secure checkout powered by industry-leading encryption</p>
                </div>
                
                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <iframe
                    src={product.checkoutLink}
                    className="w-full h-[700px] border-0"
                    title="Secure Checkout"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                  />
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>SSL Encrypted</span>
                    <span>•</span>
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Secure Payment</span>
                    <span>•</span>
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Money Back Guarantee</span>
                  </div>
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