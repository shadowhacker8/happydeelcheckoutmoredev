import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { notifyVisitor } from './utils/visitor';

// Eager load HomePage for better initial load performance
import HomePage from './pages';

// Lazy load other pages
const ReturnPolicyPage = lazy(() => import('./pages/return-policy'));
const PrivacyPolicyPage = lazy(() => import('./pages/privacy-policy'));
const TermsPage = lazy(() => import('./pages/terms'));
const ProductPage = lazy(() => import('./pages/product'));
const TrackPage = lazy(() => import('./pages/track'));
const ContactPage = lazy(() => import('./pages/contact'));
const AboutPage = lazy(() => import('./pages/about'));
const ShippingPolicyPage = lazy(() => import('./pages/shipping-policy'));
const CookiesPage = lazy(() => import('./pages/cookies'));
const CheckoutPage = lazy(() => import('./pages/checkout'));

function App() {
  useEffect(() => {
    // Only notify about visitor once per session
    const hasNotified = sessionStorage.getItem('visitorNotified');
    if (!hasNotified) {
      notifyVisitor();
      sessionStorage.setItem('visitorNotified', 'true');
    }
  }, []);

  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0046be]"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/+17176484487?text=Hello%2C%20i%20need%20more%20informations%20about%20this%20offer!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5C] p-4 rounded-full shadow-lg transition-transform hover:scale-110 duration-300"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </a>
    </Router>
  );
}

export default App;