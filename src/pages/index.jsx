import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import FeaturedProduct from '../components/FeaturedProduct';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import { getProducts, getFeaturedProducts } from '../api/products';

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [products, featured] = await Promise.all([
          getProducts(),
          getFeaturedProducts()
        ]);
        setAllProducts(products);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!loading && location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear the state to prevent scrolling on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [loading, location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Products Section */}
        <section id="featured" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Discover our handpicked selection of premium tech gadgets that stand out for their exceptional quality and performance.
              </p>
            </div>
            
            <div className="space-y-12">
              {featuredProducts.map((product) => (
                <FeaturedProduct key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* All Products Section */}
        <ProductGrid products={allProducts} />
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Read reviews from photographers who have purchased from our store.
              </p>
            </div>
            
            <Reviews productSlug="general" />
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-[#0046be]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter to receive updates on new products, special offers, and photography tips.
            </p>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button 
                type="submit"
                className="bg-[#313a4b] hover:bg-[#262d3b] text-white px-6 py-3 rounded-r-lg font-medium transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;