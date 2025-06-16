import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { getProducts } from '../api/products';
import { getCartCount } from '../utils/cart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    // Update cart count on component mount and when cart changes
    const updateCartCount = () => {
      setCartCount(getCartCount());
    };

    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setFilteredProducts([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsLoading(true);

    if (query.trim() === '') {
      setFilteredProducts([]);
      setIsLoading(false);
      return;
    }

    const filtered = products.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    setFilteredProducts(filtered);
    setIsLoading(false);
  };

  const handleProductSelect = (product) => {
    navigate(`/product/${product.slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setFilteredProducts([]);
  };

  const handleSectionClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    if (cartCount > 0) {
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Promotional Bar */}
      <div className="bg-[#ffef02] text-[#313a4b] py-2">
        <div className="container mx-auto px-4 text-center font-medium">
          Free Shipping for US&Canada Customers
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/logosvg.svg" 
                alt="HappyDeel" 
                className="w-48"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 font-heading">
              <Link to="/" className="text-[#313a4b] hover:text-[#0046be] font-medium">Home</Link>
              <button 
                onClick={() => handleSectionClick('products')} 
                className="text-[#313a4b] hover:text-[#0046be] font-medium"
              >
                Products
              </button>
              <button 
                onClick={() => handleSectionClick('featured')} 
                className="text-[#313a4b] hover:text-[#0046be] font-medium"
              >
                Featured
              </button>
              <Link to="/track" className="text-[#313a4b] hover:text-[#0046be] font-medium">Track Order</Link>
              <Link to="/contact" className="text-[#313a4b] hover:text-[#0046be] font-medium">Contact Us</Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#313a4b] hover:text-[#0046be] transition-colors duration-300"
              >
                <Search className="h-5 w-5" />
              </button>
              <button 
                onClick={handleCartClick}
                className="relative text-[#313a4b] hover:text-[#0046be] transition-colors duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-[#0046be] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#313a4b] hover:text-[#0046be] transition-colors duration-300"
              >
                <Search className="h-5 w-5" />
              </button>
              <button 
                onClick={handleCartClick}
                className="relative text-[#313a4b] hover:text-[#0046be] transition-colors duration-300"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-[#0046be] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
              <button 
                className="text-[#313a4b]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full bg-white shadow-lg p-4 border-t" ref={searchRef}>
              <div className="container mx-auto max-w-3xl">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search for products..."
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0046be] focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>

                {/* Search Results */}
                {searchQuery.trim() !== '' && (
                  <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg mt-2 max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : filteredProducts.length > 0 ? (
                      <div className="divide-y">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            className="w-full text-left p-4 hover:bg-gray-50 flex items-center space-x-4"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{product.title}</div>
                              <div className="text-sm text-gray-500">${product.price.toLocaleString()}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 font-heading">
                <Link to="/" className="text-[#313a4b] hover:text-[#0046be] font-medium">Home</Link>
                <button 
                  onClick={() => handleSectionClick('products')} 
                  className="text-left text-[#313a4b] hover:text-[#0046be] font-medium"
                >
                  Products
                </button>
                <button 
                  onClick={() => handleSectionClick('featured')} 
                  className="text-left text-[#313a4b] hover:text-[#0046be] font-medium"
                >
                  Featured
                </button>
                <Link to="/track" className="text-[#313a4b] hover:text-[#0046be] font-medium">Track Order</Link>
                <Link to="/contact" className="text-[#313a4b] hover:text-[#0046be] font-medium">Contact Us</Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;