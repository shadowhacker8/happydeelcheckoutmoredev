import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#313a4b] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/logosvg.svg" 
                alt="HappyDeel" 
                className="w-48 brightness-0 invert"
              />
            </Link>
            <p className="mb-4">
              Your trusted destination for quality electronics and second-hand items.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#0046be] mr-2" />
                <span>+17176484487</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#0046be] mr-2" />
                <span>support@happydeel.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#0046be] mr-2 mt-1" />
                <span>1726 Parsons Ave, Columbus, OH 43207, USA</span>
              </div>
              <div className="pt-2">
                <a 
                  href="https://www.instagram.com/happydeeldotcom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-300 hover:text-[#0046be] transition-colors duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#0046be] transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionClick('products')} className="hover:text-[#0046be] transition-colors duration-300 bg-transparent border-none p-0 m-0 cursor-pointer text-inherit">
                  Products
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleSectionClick('featured')} className="hover:text-[#0046be] transition-colors duration-300 bg-transparent border-none p-0 m-0 cursor-pointer text-inherit">
                  Featured
                </button>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#0046be] transition-colors duration-300">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0046be] transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Policies & Info Menu */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Policies & Info</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="hover:text-[#0046be] transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#0046be] transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0046be] transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-[#0046be] transition-colors duration-300">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#0046be] transition-colors duration-300">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0046be] transition-colors duration-300">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-[#0046be] transition-colors duration-300">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center">
              <img 
                src="/paypal.png" 
                alt="PayPal" 
                className="h-8"
              />
            </div>
            <p className="text-center">&copy; {new Date().getFullYear()} HappyDeel. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;