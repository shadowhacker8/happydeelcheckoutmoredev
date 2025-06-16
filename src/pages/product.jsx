import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getProductBySlug } from '../api/products';
import { addToCart } from '../utils/cart';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, MapPin, Truck, DollarSign, RefreshCw, ShoppingCart } from 'lucide-react';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      try {
        if (!slug) {
          navigate('/', { replace: true });
          return;
        }

        const data = await getProductBySlug(slug);
        
        if (!mounted) return;

        if (!data) {
          navigate('/', { replace: true });
          return;
        }

        setProduct(data);
        document.title = `${data.title} - HappyDeel`;

      } catch (error) {
        console.error('Error loading product:', error);
        if (mounted) {
          setError(error);
          navigate('/', { replace: true });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [slug, navigate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (showZoom) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showZoom]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Add product to cart
    addToCart(product);
    
    // Show loading state briefly for better UX
    setTimeout(() => {
      setIsAddingToCart(false);
      navigate('/checkout');
    }, 500);
  };

  const faqItems = useMemo(() => [
    {
      question: "Are the items new or used?",
      answer: "We offer both new and second-hand items. Product condition is clearly listed in the description (e.g., Brand New, Like New, Refurbished, or Used – Good Condition)."
    },
    {
      question: "Do products come with a warranty?",
      answer: "New items typically include a manufacturer warranty. For second-hand items, we offer a 30-day HappyDeel Guarantee for returns and exchanges, unless otherwise stated."
    },
    {
      question: "Can I return a product if it doesn't meet my expectations?",
      answer: "Yes! We offer 30-day hassle-free returns. The item must be in the same condition as received. Read our Return Policy for more details."
    },
    {
      question: "How long does shipping take?",
      answer: "Most orders ship within 5–8 business days. Delivery times vary by location, but you can expect your item within 5–8 business days on average."
    },
    {
      question: "Is there free shipping?",
      answer: "Yes, we offer free standard shipping on all orders currently. Express options are also available at checkout."
    },
    {
      question: "Are your second-hand products tested?",
      answer: "Absolutely. All second-hand electronics go through a multi-point inspection and are fully functional unless otherwise stated."
    },
    {
      question: "Can I trust the product photos?",
      answer: "Yes — what you see is what you get. Our photos show the actual product (or a very close representation for new items). We do not use stock images for used items."
    },
    {
      question: "Is local pickup available?",
      answer: "Currently, we are an online-only store, but we're working on introducing local pickup options in select cities soon."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us anytime at support@happydeel.com or call us at +17176484487. We're available 7 days a week."
    }
  ], []);

  const getDeliveryDates = () => {
    const today = new Date();
    const day1 = new Date(today);
    day1.setDate(today.getDate() + 5);
    const day2 = new Date(today);
    day2.setDate(today.getDate() + 8);
    
    const formatDate = (date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    return `${formatDate(day1)}-${formatDate(day2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-gray-600">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're having trouble loading this product.</p>
            <Link to="/" className="text-[#0046be] hover:text-[#003494]">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link to="/" className="text-[#0046be] hover:text-[#003494]">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { title, description, price, images, condition } = product;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery - Fixed */}
            <div className="relative lg:sticky lg:top-24 lg:self-start">
              <div 
                onClick={() => setShowZoom(true)}
                className="cursor-zoom-in relative group"
              >
                <img 
                  src={images[activeImage]} 
                  alt={`${title} - Image ${activeImage + 1}`}
                  className="w-full h-[500px] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-lg"></div>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 flex justify-center space-x-2 overflow-x-auto py-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      activeImage === idx ? 'ring-2 ring-[#0046be]' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {activeImage === idx && (
                      <div className="absolute inset-0 bg-white/10"></div>
                    )}
                  </button>
                ))}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-[#0046be] hover:text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-[#0046be] hover:text-white p-2 rounded-full transition-all duration-300"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Product Info - Scrollable */}
            <div className="lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4 scrollbar-hide">
              <h1 className="text-3xl font-medium text-gray-900">{title}</h1>
              <div className="mt-2 text-gray-600">{condition}</div>
              <div className="mt-4 text-4xl font-bold text-gray-900">
                ${price.toLocaleString()}
              </div>
              
              {/* Shipping Information */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-[#0046be] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Ships from:</p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <Truck className="h-6 w-6 text-[#0046be] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Order today to get by:</p>
                    <p className="text-sm text-gray-600">{getDeliveryDates()}</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-[#0046be] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Cost to ship:</p>
                    <p className="text-sm text-gray-600">FREE</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-[#0046be] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Returns:</p>
                    <p className="text-sm text-gray-600">Accepted</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-[#0046be] hover:bg-[#003494] text-white py-4 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Hidden PayPal Button (as requested) */}
              <div style={{ display: 'none' }}>
                {/* PayPal button would be here but hidden */}
              </div>
              
              {/* Product Description */}
              <div className="mt-8">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Product Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{description}</p>
              </div>
              
              {/* FAQ Section */}
              <div className="mt-12 border-t pt-8">
                <button
                  onClick={() => setShowFAQ(!showFAQ)}
                  className="w-full flex items-center justify-between text-left text-gray-900 hover:text-[#0046be] transition-colors duration-300"
                >
                  <span className="text-xl font-medium">Frequently Asked Questions</span>
                  {showFAQ ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                
                {showFAQ && (
                  <div className="mt-6 space-y-6">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                        <h3 className="font-medium text-gray-900 mb-2">{item.question}</h3>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Zoom Modal */}
      {showZoom && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50"
          onClick={() => setShowZoom(false)}
        >
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowZoom(false);
              }}
              className="p-2 text-white hover:text-[#0046be] transition-colors duration-200"
              aria-label="Close zoom view"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
          
          <div 
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full">
              <img
                src={images[activeImage]}
                alt={`${title} - Image ${activeImage + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-[#0046be] p-3 rounded-full text-white transition-colors duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-[#0046be] p-3 rounded-full text-white transition-colors duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;